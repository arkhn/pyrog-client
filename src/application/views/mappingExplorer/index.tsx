import {gql} from 'apollo-boost'
import {
    Button,
    Card,
    Elevation,
    NonIdealState,
    Spinner,
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
import ColumnPicker from '../../components/columnPicker'
import FhirResourceTree from '../../components/fhirResourceTree'
import InputColumnsTable from '../../components/inputColumnsTable'
import StringSelect from '../../components/selects/stringSelect'

// Import types
import {
    IReduxStore,
    IView,
} from '../../types'

import './style.less'

// Requests
const getMappings = require('./queries/getMappings.graphql')
const getAttributes = require('./queries/getAttributes.graphql')
const subscription = require('./queries/subscription.graphql')
const inputColumnMutation = require('./queries/inputColumnMutation.graphql')
const deleteInputColumn = require('./queries/deleteInputColumn.graphql')
const attributeSubscription = require('./queries/attributeSubscription.graphql')
const getInputColumns = require('./queries/getInputColumns.graphql')

const arkhnLogo = require("../../img/arkhn_logo_only_white.svg") as string;

export interface IMappingExplorerState {
    selectedDatabase: string,
    selectedFhirResource: string,
    selectedFhirAttribute: string,
}

interface IMappingExplorerViewState extends IView, IMappingExplorerState {}

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
        this.props.dispatch(fetchDatabaseNames())
        this.props.dispatch(fetchFhirResourceNames())

        this.props.dispatch(updateDatabase('Crossway'))
        this.props.dispatch(changeFhirResource('Patient'))
        this.props.dispatch(updateFhirAttribute('link.other'))
    }


    public render = () => {
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
                    query={getAttributes}
                    variables={{
                        database: selectedDatabase,
                        resource: selectedFhirResource,
                        attribute: selectedFhirAttribute,
                    }}
                    skip={!selectedDatabase ||
                        !selectedFhirResource ||
                        !selectedFhirAttribute
                    }
                >
                    {({ loading, error, data }) => {
                        {/* Before rendering this view, verify that all
                        inconsistent usecases are sorted (is the query loading,
                        did it trigger an error, did it return data?) */}
                        if (loading) {
                            return <Spinner />
                        }
                        if (error) {
                            console.log(error)
                            return <p>Something went wrong</p>
                        }
                        if (!data || data.attributes.length == 0) {
                            return <div>Does not exist yet</div>
                        }

                        const attribute = data.attributes[0]

                        {/* Here, one subscribes to changes on the currently displayed
                        fhir attribute. This is useful when an input column is added
                        or deleted for instance. */}
                        return <Subscription
                            subscription={attributeSubscription}
                            variables={{
                                id: attribute.id,
                            }}
                        >
                            {({ data, loading }) => {
                                {/* If data.attributeSubscription is available,
                                then it is what we should display since it means
                                an inputColumn was added or deleted. */}
                                const inputColumns = (data && data.attributeSubscription) ?
                                    data.attributeSubscription.node.inputColumns :
                                    (attribute.inputColumns ? attribute.inputColumns : [])

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
                                                const column = (data && data.inputColumnSubscription) ?
                                                    data.inputColumnSubscription.node :
                                                    inputColumn

                                                return column ? <div className='input-column'>
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
                                                                    deleteInputColumnName({
                                                                        variables: {
                                                                            attributeId: attribute.id,
                                                                            inputColumnId: column.id,
                                                                        }
                                                                    })
                                                                }}
                                                            />
                                                        }}
                                                    </Mutation>
                                                    <Card elevation={Elevation.ONE} className='input-column-info'>
                                                        <div className='input-column-name'>
                                                            <Tag large={true}>{column.owner}</Tag>
                                                            <Tag large={true}>{column.table}</Tag>
                                                            <Tag large={true}>{column.column}</Tag>
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
                                                                        inputItem={column.joinSourceColumn}
                                                                        items={['toto', 'tutu']}
                                                                        onChange={(e: string) => {
                                                                            changeInputColumnJoin({
                                                                                variables: {
                                                                                    id: column.id,
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
                                                                        inputItem={column.script}
                                                                        items={['script1.py', 'script2.py']}
                                                                        loading={loading}
                                                                        onChange={(e: string) => {
                                                                            changeInputColumnScript({
                                                                                variables: {
                                                                                    id: column.id,
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
                                                    </Card>
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
                        selectedNode={selectedFhirAttribute}
                    />
                </div>
            </div>
        </div>
    }
}