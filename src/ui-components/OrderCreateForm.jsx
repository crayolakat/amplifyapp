/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { fetchByPath, validateField } from "./utils";
import { API } from "aws-amplify";
import { createOrder } from "../graphql/mutations";
export default function OrderCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    tracking_company: "",
    tracking_number: "",
    status: "",
  };
  const [tracking_company, setTracking_company] = React.useState(
    initialValues.tracking_company
  );
  const [tracking_number, setTracking_number] = React.useState(
    initialValues.tracking_number
  );
  const [status, setStatus] = React.useState(initialValues.status);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setTracking_company(initialValues.tracking_company);
    setTracking_number(initialValues.tracking_number);
    setStatus(initialValues.status);
    setErrors({});
  };
  const validations = {
    tracking_company: [],
    tracking_number: [],
    status: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          tracking_company,
          tracking_number,
          status,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await API.graphql({
            query: createOrder,
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "OrderCreateForm")}
      {...rest}
    >
      <TextField
        label="Tracking company"
        isRequired={false}
        isReadOnly={false}
        value={tracking_company}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              tracking_company: value,
              tracking_number,
              status,
            };
            const result = onChange(modelFields);
            value = result?.tracking_company ?? value;
          }
          if (errors.tracking_company?.hasError) {
            runValidationTasks("tracking_company", value);
          }
          setTracking_company(value);
        }}
        onBlur={() => runValidationTasks("tracking_company", tracking_company)}
        errorMessage={errors.tracking_company?.errorMessage}
        hasError={errors.tracking_company?.hasError}
        {...getOverrideProps(overrides, "tracking_company")}
      ></TextField>
      <TextField
        label="Tracking number"
        isRequired={false}
        isReadOnly={false}
        value={tracking_number}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              tracking_company,
              tracking_number: value,
              status,
            };
            const result = onChange(modelFields);
            value = result?.tracking_number ?? value;
          }
          if (errors.tracking_number?.hasError) {
            runValidationTasks("tracking_number", value);
          }
          setTracking_number(value);
        }}
        onBlur={() => runValidationTasks("tracking_number", tracking_number)}
        errorMessage={errors.tracking_number?.errorMessage}
        hasError={errors.tracking_number?.hasError}
        {...getOverrideProps(overrides, "tracking_number")}
      ></TextField>
      <TextField
        label="Status"
        isRequired={true}
        isReadOnly={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              tracking_company,
              tracking_number,
              status: value,
            };
            const result = onChange(modelFields);
            value = result?.status ?? value;
          }
          if (errors.status?.hasError) {
            runValidationTasks("status", value);
          }
          setStatus(value);
        }}
        onBlur={() => runValidationTasks("status", status)}
        errorMessage={errors.status?.errorMessage}
        hasError={errors.status?.hasError}
        {...getOverrideProps(overrides, "status")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
