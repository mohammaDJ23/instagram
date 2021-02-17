import { useCallback, useReducer } from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      let formVald = true;

      for (let input in state.inputs) {
        if (!state.inputs[input]) {
          continue;
        }

        if (input === action.id) {
          formVald = formVald && action.isValid;
        } else {
          formVald = formVald && state.inputs[input].isValid;
        }
      }

      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.id]: { value: action.value, isValid: action.isValid }
        },
        formValid: formVald
      };
    case "REPLACE":
      return {
        ...state,
        inputs: action.initialInputs,
        formValid: action.formValid
      };
    default:
      return state;
  }
};

export const useAuth = (initialInputs, formValid) => {
  const [formState, dispatch] = useReducer(reducer, {
    inputs: initialInputs,
    formValid: formValid
  });

  const onInput = useCallback((id, value, isValid) => {
    dispatch({ type: "CHANGE", id, value, isValid });
  }, []);

  const switchInfo = useCallback((initialInputs, formValid) => {
    dispatch({ type: "REPLACE", initialInputs, formValid });
  }, []);

  return [formState, onInput, switchInfo];
};
