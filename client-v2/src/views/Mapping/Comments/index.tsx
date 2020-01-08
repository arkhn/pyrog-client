import * as React from "react"
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useSelector } from "react-redux";
import {
  FormGroup,
  TextArea,
} from "@blueprintjs/core";

import { IReduxStore } from "../../../types";


// GRAPHQL
const qCommentsForAttribute = require("src/graphql/queries/commentsForAttribute.graphql");
const mUpdateAttribute = require("src/graphql/mutations/updateAttribute.graphql");

const Comments = () => {

  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);

  const { data, loading } =
    useQuery(qCommentsForAttribute, {
      variables: {
        attributeId: selectedNode.attribute.id
      },
      skip: !selectedNode.attribute.id
    })
  const [updateAttribute] = useMutation(mUpdateAttribute)

  const [comments, setComments] = React.useState("")

  React.useEffect(() => {
    setComments(
      data && data.attribute.comments
        ? data.attribute.comments
        : ""
      )
  }, [selectedNode, loading])

  return (
    <div>
      <FormGroup label={<h3>Comments</h3>}>
        <div>
          <TextArea
            className={"bp3-fill"}
            value={comments}
            disabled={loading || !selectedNode.attribute.id}
            onChange={e => {
              setComments(e.target.value)
              updateAttribute({
                variables: {
                  attributeId: selectedNode.attribute.id,
                  data: {
                    comments: e.target.value
                  }
                },
              })
            }}
          />
        </div>
      </FormGroup>
    </div>
  )
}

export default Comments