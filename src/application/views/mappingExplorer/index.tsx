import {gql} from 'apollo-boost'
import {
    Button,
    NonIdealState,
    Tag,
} from '@blueprintjs/core'
import * as React from 'react'
import {
    Mutation,
    Query,
    Subscription,
} from 'react-apollo'
import {connect} from 'react-redux'

// Import actions
import {
    changeDatabase,
    changeFhirResource,
    updateDatabase,
    updateFhirAttribute,
    updateFhirResource,
} from './actions'

import {
    fetchDatabaseNames,
} from '../../actions/databases'

import {
    fetchFhirResourceNames,
} from '../../actions/fhirResources'

// Import components
import FhirResourceTree from '../../components/fhirResourceTree'
import InputColumnsTable from '../../components/inputColumnsTable'
import StringSelect from '../../components/selects/stringSelect'

// Import types
import {
    IMappingExplorerViewState,
    IReduxStore,
} from '../../types'

import './style.less'

// Requests
const getMappings = require('./queries/getMappings.graphql')
const subscription = require('./queries/subscription.graphql')
const inputColumnMutation = require('./queries/inputColumnMutation.graphql')
const deleteInputColumn = require('./queries/deleteInputColumn.graphql')
const attributeSubscription = require('./queries/attributeSubscription.graphql')
const getInputColumns = require('./queries/getInputColumns.graphql')

const arkhnLogo = require("../../img/arkhn_logo_only_white.svg") as string;

const mapReduxStateToReactProps = (state : IReduxStore): IMappingExplorerViewState => {
    return {
        ...state.views.mappingExplorer,
        data: state.data,
        dispatch: state.dispatch,
    }
}

const reduxify = (mapReduxStateToReactProps: any, mapDispatchToProps?: any, mergeProps?: any, options?: any) : any => {
     return (target: any) => (
         connect(
             mapReduxStateToReactProps,
             mapDispatchToProps,
             mergeProps,
             options
         )(target) as any
     )
}

@reduxify(mapReduxStateToReactProps)
export default class MappingExplorerView extends React.Component<IMappingExplorerViewState, any> {
    public componentDidMount() {
        this.props.dispatch(fetchDatabaseNames('https://api.live.arkhn.org/schemas'))
        this.props.dispatch(fetchFhirResourceNames('https://api.live.arkhn.org/fhir_resources'))

        this.props.dispatch(updateDatabase('Crossway'))
        this.props.dispatch(changeFhirResource('Patient'))
        this.props.dispatch(updateFhirAttribute('name.given'))
    }


    public render = () => {
        console.log(getInputColumns)
        const {
            data,
            dispatch,
            selectedDatabase,
            selectedFhirResource,
            selectedFhirAttribute,
        } = this.props

        const nonIdealState = <NonIdealState
            description={'Select a FHIR resource attribute by clicking on a node in the left panel.'}
            icon={<span dangerouslySetInnerHTML={{__html: arkhnLogo}}/>}
            title={'No FHIR attribute selected'}
        />

        return <div id='mapping-explorer-container'>
            <div id='left-part'>
                <div className={'panel-header'}>
                    <StringSelect
                        icon={'database'}
                        inputItem={selectedDatabase}
                        intent={'primary'}
                        items={Object.keys(data.databases.databaseNames)}
                        loading={data.databases.loadingDatabaseNames || data.databases.loadingDatabaseSchema}
                        onChange={(databaseName: string) => {
                            dispatch(changeDatabase(databaseName))
                        }}
                    />
                </div>

                {/* Components below are fed with data coming from our GraphQL server.
                Here, we mainly display the input columns of a given fhir attribute. */}
                <Query
                    query={getInputColumns}
                    variables={{
                        database: selectedDatabase,
                        resource: selectedFhirResource,
                        attribute: selectedFhirAttribute,
                    }}
                >
                    {({ loading, error, data }) => {
                        if (loading) {
                            return <p>Loading...</p>
                        }
                        if (error) {
                            console.log('Went through an error...')
                            console.log(error)
                            return <p>Something went wrong</p>
                        }

                        // TODO: handle cases where the query returns nothing
                        let inputColumns: any = []
                        let attributeId: any = null

                        try {
                            inputColumns = data.mappings[0].resources[0].attributes[0].inputColumns
                            attributeId = data.mappings[0].resources[0].attributes[0].id
                        }
                        catch (ex) {
                            console.log(ex)
                        }

                        {/* Here, one subscribes to changes on the currently displayed
                        fhir attribute. This is useful when an input column is added
                        or deleted for instance. */}
                        return <Subscription
                            subscription={attributeSubscription}
                            variables={{
                                id: attributeId,
                            }}
                        >
                            {({ data, loading }) => {
                                console.log('data subscription')
                                console.log(data)
                                try {
                                    if (data.attributeSubscription.node) {
                                        inputColumns = data.attributeSubscription.node.inputColumns
                                    }
                                }
                                catch (ex) {
                                    console.log(ex)
                                }

                                return <div id='input-columns'>
                                <div id='input-column-rows'>
                                    {inputColumns.map((inputColumn: any, index: number) => {
                                        {/* Each input column will generate a new subscription
                                        to the server, so as to make sure the user is always
                                        synchronised with information written in the backend. */}
                                        return <Subscription
                                            key={index}
                                            subscription={subscription}
                                            variables={{
                                                id: inputColumn.id,
                                            }}
                                        >
                                            {({ data, loading }) => {
                                                const c = (data && data.inputColumnSubscription.node) ? data.inputColumnSubscription.node : inputColumn

                                                return c ? <div className='input-column'>
                                                    {/* The following mutation allows one to
                                                    update the fhir attribute under study
                                                    by deleting one of it's input columns.
                                                    This allows to re-render all input columns
                                                    and re-generate subscriptions*/}
                                                    <Mutation
                                                        mutation={deleteInputColumn}
                                                    >
                                                        {(deleteInputColumnName, {data, loading}) => {
                                                            return <Button
                                                                icon={'trash'}
                                                                minimal={true}
                                                                onClick={() => {
                                                                    console.log(attributeId)
                                                                    console.log(c.id)
                                                                    deleteInputColumnName({
                                                                        variables: {
                                                                            attributeId: attributeId,
                                                                            inputColumnId: c.id,
                                                                        }
                                                                    })
                                                                }}
                                                            />
                                                        }}
                                                    </Mutation>
                                                    <div className='input-column-info'>
                                                        <div className='input-column-name'>
                                                            <Tag large={true}>{c.owner}</Tag>
                                                            <Tag large={true}>{c.table}</Tag>
                                                            <Tag large={true}>{c.column}</Tag>
                                                        </div>
                                                        <div className='input-column-join'>
                                                            {/* Here is a simple mutation
                                                            intended to modify input column's
                                                            information. */}
                                                            <Mutation
                                                                mutation={inputColumnMutation}
                                                            >
                                                                {(changeInputColumnJoin, {data, loading}) => {
                                                                    return <StringSelect
                                                                        inputItem={c.joinSourceColumn}
                                                                        items={['toto', 'tutu']}
                                                                        onChange={(e: string) => {
                                                                            changeInputColumnJoin({
                                                                                variables: {
                                                                                    id: c.id,
                                                                                    data: {
                                                                                        joinSourceColumn: e,
                                                                                    },
                                                                                },
                                                                            })
                                                                        }}
                                                                    />
                                                                }}
                                                            </Mutation>
                                                        </div>
                                                        <div className='input-column-script'>
                                                            <Mutation
                                                                mutation={inputColumnMutation}
                                                            >
                                                                {(changeInputColumnScript, {data, loading}) => {
                                                                    return <StringSelect
                                                                        inputItem={c.script}
                                                                        items={['script1.py', 'script2.py']}
                                                                        loading={loading}
                                                                        onChange={(e: string) => {
                                                                            changeInputColumnScript({
                                                                                variables: {
                                                                                    id: c.id,
                                                                                    data: {
                                                                                        script: e,
                                                                                    },
                                                                                },
                                                                            })
                                                                        }}
                                                                    />
                                                                }}
                                                            </Mutation>
                                                        </div>
                                                    </div>
                                                </div> : null
                                            }}
                                        </Subscription>
                                    })}
                                </div>
                                <div id='input-column-merging-script'>
                                    <StringSelect
                                        icon={'layout-hierarchy'}
                                        inputItem={'mergingScript.py'}
                                        items={[]}
                                        loading={false}
                                        onChange={null}
                                    />
                                </div>
                            </div>
                        }}
                    </Subscription>
                    }}
                </Query>
            </div>
            <div id='right-part'>
                <div className={'panel-header'}>
                    <StringSelect
                        icon={'layout-hierarchy'}
                        inputItem={selectedFhirResource}
                        intent={'primary'}
                        items={Object.keys(data.fhirResources.resourceNames)}
                        loading={data.fhirResources.loadingFhirResourceNames || data.fhirResources.loadingFhirResourceJson}
                        onChange={(resource: string) => {
                            dispatch(changeFhirResource(resource))
                        }}
                    />
                </div>
                <div id='fhir-resource-tree'>
                    <FhirResourceTree
                        json={
                            selectedFhirResource ?
                                data.fhirResources.jsonByResourceName[selectedFhirResource] :
                                null
                        }
                        onClickCallback={(attributeFlatPath: any) => {
                            dispatch(updateFhirAttribute(attributeFlatPath))
                        }}
                    />
                </div>
            </div>
        </div>
    }
}
