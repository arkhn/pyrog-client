import {
  Button,
  Card,
  ControlGroup,
  Elevation,
  FormGroup,
  InputGroup,
  Position
} from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';
import { Attribute, ResourceDefinition } from '@arkhn/fhir.ts';

import { onError } from 'services/apollo';
import { IReduxStore } from 'types';

import { setAttributeInMap } from 'services/resourceInputs/actions';
import { selectInputGroup } from 'services/selectedNode/actions';

import StringSelect from 'components/selects/stringSelect';
import IdentifierSystemInput from './IdentifierSystemInput';

// GRAPHQL
const qSourcesAndResources = loader(
  'src/graphql/queries/sourcesAndResources.graphql'
);
const mCreateAttribute = loader(
  'src/graphql/mutations/createAttribute.graphql'
);
const mCreateInputGroup = loader(
  'src/graphql/mutations/createInputGroup.graphql'
);
const mCreateStaticInput = loader(
  'src/graphql/mutations/createStaticInput.graphql'
);

interface Props {
  input: string;
}

const InputStatic = ({ input }: Props): React.ReactElement => {
  const dispatch = useDispatch();
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const { attribute, resource, selectedInputGroup } = useSelector(
    (state: IReduxStore) => state.selectedNode
  );
  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );
  const { availableResources } = useSelector(
    (state: IReduxStore) => state.fhir
  );

  const [staticValue, setStaticValue] = useState('');

  const { data: dataSources } = useQuery(qSourcesAndResources, {
    fetchPolicy: 'no-cache'
  });

  const sources = dataSources ? dataSources.sources : [];
  const path = attribute.path;
  let attributeId = attributesForResource[path]
    ? attributesForResource[path].id
    : null;
  // The id of the input group in which we want to put the new input.
  // If it is null, it means that we'll need to create a new input group first.
  let inputGroupId =
    selectedInputGroup === null ||
    !attributesForResource[path] ||
    selectedInputGroup >= attributesForResource[path].inputGroups.length
      ? null
      : attributesForResource[path].inputGroups[selectedInputGroup].id;

  useEffect(() => {
    // TODO we should use attribute.isReferenceType here but Attribute objects
    // lose their accessors in Redux
    if (attribute.definition.id === 'Reference.type') {
      setStaticValue('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attribute]);

  const [createAttribute] = useMutation(mCreateAttribute, {
    onError: onError(toaster)
  });
  const [createInputGroup] = useMutation(mCreateInputGroup, {
    onError: onError(toaster)
  });
  const [
    createStaticInput,
    { loading: creatingStaticInput }
  ] = useMutation(mCreateStaticInput, { onError: onError(toaster) });

  const addStaticValue = async (value: string): Promise<void> => {
    try {
      // First, we create the attribute if it doesn't exist
      if (!attributeId) {
        const { data: attr } = await createAttribute({
          variables: {
            resourceId: resource.id,
            definitionId: attribute.types[0],
            path,
            sliceName: attribute.definition.sliceName
          }
        });
        attributeId = attr.createAttribute.id;
      }
      // Then, we create the inputGroup if needed
      if (
        selectedInputGroup === null ||
        !attributesForResource[path] ||
        selectedInputGroup >= attributesForResource[path].inputGroups.length
      ) {
        const { data: group } = await createInputGroup({
          variables: {
            attributeId
          }
        });
        inputGroupId = group.createInputGroup.id;
      }
      // Also, we create the parent attributes if they don't exist
      let currentAttribute = attribute;
      while (currentAttribute.parent) {
        currentAttribute = currentAttribute.parent;
        const parentPath = currentAttribute.path;
        if (
          !attributesForResource[parentPath] &&
          !currentAttribute.isArray &&
          currentAttribute.types.length <= 1
        ) {
          const { data: attr } = await createAttribute({
            variables: {
              resourceId: resource.id,
              definitionId: currentAttribute.types[0],
              path: parentPath,
              sliceName: currentAttribute.definition.sliceName
            }
          });
          dispatch(setAttributeInMap(parentPath, attr.createAttribute));
        }
      }
      const { data }: any = await createStaticInput({
        variables: {
          inputGroupId,
          staticValue: value
        }
      });
      if (selectedInputGroup === null)
        dispatch(
          selectInputGroup(attributesForResource[path].inputGroups.length)
        );
      dispatch(setAttributeInMap(path, data.createInput.inputGroup.attribute));
    } catch (e) {
      console.log(e);
    }
  };

  const renderReferenceTypeDropDown = (): React.ReactElement => (
    <React.Fragment>
      <StringSelect
        items={availableResources.map((t: ResourceDefinition) => t.name)}
        onChange={setStaticValue}
        inputItem={staticValue}
        popoverProps={{
          autoFocus: true,
          boundary: 'viewport',
          canEscapeKeyClose: true,
          lazy: true,
          position: Position.LEFT_TOP,
          usePortal: true
        }}
      />
    </React.Fragment>
  );

  const renderTextInput = (): React.ReactElement => (
    <React.Fragment>
      <InputGroup
        onChange={(event: React.FormEvent<HTMLElement>): void => {
          const target = event.target as HTMLInputElement;
          setStaticValue(target.value);
        }}
        placeholder="Static input"
        value={staticValue}
      />
    </React.Fragment>
  );

  return (
    <div className="input-static">
      <div className="input-card">
        <Card elevation={Elevation.ONE}>
          <div className="card-absolute">
            <div className="card-flex">
              <div className="card-tag">Static</div>
            </div>
          </div>
          <div className="static-input-form">
            <ControlGroup>
              {attribute.definition.id === 'Reference.type' ? (
                renderReferenceTypeDropDown()
              ) : attribute.definition.id === 'Identifier.system' ? (
                <IdentifierSystemInput
                  attribute={attribute}
                  sources={sources}
                  creatingStaticInput={creatingStaticInput}
                  addStaticValue={addStaticValue}
                />
              ) : (
                renderTextInput()
              )}
            </ControlGroup>
          </div>
        </Card>
        <Button
          icon={'trash'}
          // loading={loadDelInput}
          minimal={true}
          // onClick={onClickDelete}
        />
      </div>
    </div>
  );
};

export default InputStatic;