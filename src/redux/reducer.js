import ACTIONS from "./actions";

const evaluate = (state) => {
    let { lastOperand, currentOperand, operation } = state;
    let last = parseFloat(lastOperand);
    let current = parseFloat(currentOperand);

    let res = "";
    // eslint-disable-next-line default-case
    switch (operation) {
        case "➕":
            res = last + current;
            break;
        case "➖":
            res = last - current;
            break;
        case "✖":
            res = last * current;
            break;
        case "➗":
            res = last / current;
    }
    return res.toString();
};

const reducer = (
    state = {
        currentOperand: "",
        lastOperand: "",
        operation: "",
        overwrite: false,
    },
    action
) => {
    switch (action.type) {
        case ACTIONS.ADD_DIGIT:
            if (state.overwrite)
                return {
                    ...state,
                    currentOperand: action.digit,
                    overwrite: false,
                };
            if (state.currentOperand === "0" && action.digit === "0")
                // 只按0只显示一个0
                return state;
            if (state.currentOperand === "0" && action.digit !== ".")
                // 0在前自动省略
                return {
                    ...state,
                    currentOperand: action.digit,
                };
            if (action.digit === "." && state.currentOperand.includes("."))
                // 不能打多个'.'
                return state;
            if (action.digit === "." && state.currentOperand === "")
                // 规避直接按'.'的情况
                return {
                    ...state,
                    currentOperand: "0.",
                };
            return {
                ...state,
                currentOperand: state.currentOperand + action.digit,
            };

        case ACTIONS.DELETE_DIGIT:
            if (state.overwrite)
                return {
                    ...state,
                    currentOperand: "",
                    overwrite: false,
                };
            if (state.currentOperand === "") return state;
            return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1),
            };

        case ACTIONS.CHOOSE_OPERATION:
            if (state.lastOperand === "" && state.currentOperand === "")
                return state;
            if (state.lastOperand === "")
                return {
                    ...state,
                    lastOperand: state.currentOperand,
                    operation: action.operation,
                    currentOperand: "",
                };
            if (state.currentOperand === "")
                return {
                    ...state,
                    operation: action.operation,
                };
            return {
                ...state,
                lastOperand: evaluate(state),
                operation: action.operation,
                currentOperand: "",
            };

        case ACTIONS.CLEAR:
            return {
                ...state,
                currentOperand: "",
                lastOperand: "",
                operation: "",
            };

        case ACTIONS.EVALUATE:
            if (
                state.currentOperand === "" ||
                state.lastOperand === "" ||
                state.operation === ""
            )
                return state;
            return {
                ...state,
                currentOperand: evaluate(state),
                lastOperand: "",
                operation: "",
                overwrite: true,
            };
        default:
            return state;
    }
};

export default reducer;
