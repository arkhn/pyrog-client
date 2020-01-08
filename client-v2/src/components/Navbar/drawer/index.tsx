import { useApolloClient } from "@apollo/react-hooks";
import {
  Button,
  Classes,
  Drawer as BPDrawer,
  H3,
  Icon,
  InputGroup,
  FormGroup,
  Spinner
} from "@blueprintjs/core";
import * as React from "react";
import { Mutation } from "react-apollo";
import { useSelector } from "react-redux";

import "./style.less";
import StringSelect from "src/components/selects/stringSelect";
import { IReduxStore } from "src/types";

const qCredentialForSource = require("src/graphql/queries/credentialForSource.graphql");
const upsertCredential = require("src/graphql/mutations/upsertCredential.graphql");

interface IProps {
  title: string;
  isOpen: boolean;
  onClose: any;
}

const Drawer = ({ title, isOpen, onClose }: IProps) => {
  const models = ["POSTGRES"];

  const [host, setHost] = React.useState("");
  const [port, setPort] = React.useState("");
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [database, setDatabase] = React.useState("");
  const [model, setModel] = React.useState(models[0]);
  const [hasChanged, setHasChanged] = React.useState(false);
  const [hasSuccessfullyChanged, setHasSuccessfullyChanged] = React.useState(
    false
  );
  const [loading, setLoading] = React.useState(true);
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const client = useApolloClient();

  React.useEffect(() => {
    if (selectedNode.source) {
      client
        .query({
          query: qCredentialForSource,
          variables: {
            sourceId: selectedNode.source.id
          },
          fetchPolicy: "network-only"
        })
        .then((response: any) => {
          setLoading(false);
          if (!response.data.source) {
            return;
          }

          const cred = response.data.source.credential;
          if (cred) {
            setHost(cred.host);
            setPort(cred.port);
            setLogin(cred.login);
            setPassword(cred.password);
            setDatabase(cred.database);
            setModel(cred.model);
          }
        })
        .catch((error: any) => {
          console.log(error);
          throw new Error(error);
        });
    }
  }, [selectedNode]);

  return (
    <BPDrawer
      className="drawer"
      icon="properties"
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      size={BPDrawer.SIZE_SMALL}
    >
      <div className={Classes.DRAWER_BODY}>
        <div className={Classes.DIALOG_BODY}>
          <H3 className="inline-title">
            <span>Database credentials</span>
            <span>{loading && <Spinner size={15} />}</span>
          </H3>
          <Mutation
            mutation={upsertCredential}
            onCompleted={(data: any) => {
              setHasChanged(false);
              setHasSuccessfullyChanged(true);
            }}
            onError={(error: any) => {
              console.log("ERROR", error);
            }}
          >
            {(upsert: any, { loading }: any) => {
              return (
                <form
                  onSubmit={(e: any) => {
                    e.preventDefault();
                    upsert({
                      variables: {
                        host,
                        port,
                        login,
                        database,
                        password,
                        model,
                        sourceId: selectedNode.source.id
                      }
                    });
                  }}
                >
                  <FormGroup label="Host">
                    <InputGroup
                      value={host}
                      disabled={loading}
                      leftIcon={"desktop"}
                      onChange={(event: any) => {
                        setHost(event.target.value);
                        setHasChanged(true);
                      }}
                      placeholder={"Host"}
                    />
                  </FormGroup>
                  <FormGroup label="Port">
                    <InputGroup
                      value={port}
                      disabled={loading}
                      leftIcon={"numerical"}
                      onChange={(event: any) => {
                        setPort(event.target.value);
                        setHasChanged(true);
                      }}
                      placeholder={"Port"}
                    />
                  </FormGroup>
                  <FormGroup label="Database name">
                    <InputGroup
                      value={database}
                      disabled={loading}
                      leftIcon={"database"}
                      onChange={(event: any) => {
                        setDatabase(event.target.value);
                        setHasChanged(true);
                      }}
                      placeholder={"Database name"}
                    />
                  </FormGroup>
                  <FormGroup label="Login">
                    <InputGroup
                      value={login}
                      disabled={loading}
                      leftIcon={"user"}
                      onChange={(event: any) => {
                        setLogin(event.target.value);
                        setHasChanged(true);
                      }}
                      placeholder={"Login"}
                    />
                  </FormGroup>
                  <FormGroup label="Password">
                    <InputGroup
                      value={password}
                      disabled={loading}
                      leftIcon={"key"}
                      onChange={(event: any) => {
                        setPassword(event.target.value);
                        setHasChanged(true);
                      }}
                      placeholder={"Password"}
                      type={"password"}
                    />
                  </FormGroup>
                  <FormGroup label="Type">
                    <StringSelect
                      filterable={false}
                      items={models}
                      disabled={loading}
                      inputItem={model}
                      onChange={(item: string) => {
                        setHasChanged(true);
                        setModel(item);
                      }}
                    />
                  </FormGroup>
                  <Button
                    intent={
                      hasSuccessfullyChanged && !hasChanged
                        ? "success"
                        : "primary"
                    }
                    disabled={
                      (hasSuccessfullyChanged && !hasChanged) || !hasChanged
                    }
                    loading={loading}
                    icon={
                      hasSuccessfullyChanged &&
                      !hasChanged && <Icon intent={"success"} icon={"tick"} />
                    }
                    type={"submit"}
                  >
                    Save
                  </Button>
                </form>
              );
            }}
          </Mutation>
        </div>
      </div>
    </BPDrawer>
  );
};

export default Drawer;
