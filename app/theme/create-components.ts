import {
    Components,
    createTheme,
    filledInputClasses,
    inputLabelClasses,
    outlinedInputClasses,
    paperClasses,
    tableCellClasses,
    Theme,
} from "@mui/material";

// Used only to create transitions
const muiTheme = createTheme();

export function createComponents(
    config: any
): Components<Omit<Theme, "components">> {
    const { palette } = config;

    return {
        MuiAvatar: {
            styleOverrides: {
                root: {
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: 0,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                    textTransform: "none",
                },
                sizeSmall: {
                    padding: "6px 16px",
                },
                sizeMedium: {
                    padding: "8px 20px",
                },
                sizeLarge: {
                    padding: "11px 24px",
                },
                textSizeSmall: {
                    padding: "7px 12px",
                },
                textSizeMedium: {
                    padding: "9px 16px",
                },
                textSizeLarge: {
                    padding: "12px 16px",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    [`&.${paperClasses.elevation1}`]: {
                        boxShadow:
                            "0px 4px 20px 0px rgba(0, 0, 0, 0.08), 0px 0px 0px 1px rgba(0, 0, 0, 0.04)",
                    },
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: "16px",
                    "&:last-child": {
                        paddingBottom: "16px",
                    },
                },
            },
        },
        MuiCardHeader: {
            defaultProps: {
                titleTypographyProps: {
                    variant: "h6",
                },
                subheaderTypographyProps: {
                    variant: "body2",
                },
            },
            styleOverrides: {
                root: {
                    padding: "32px 24px 16px",
                },
            },
        },
        MuiCardActions: {
            styleOverrides: {
                root: {
                    padding: "12px",
                    // '&:last-child': {
                    //   paddingBottom: '24px'
                    // }
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                "*": {
                    boxSizing: "border-box",
                },
                html: {
                    MozOsxFontSmoothing: "grayscale",
                    WebkitFontSmoothing: "antialiased",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100%",
                    width: "100%",
                },
                body: {
                    display: "flex",
                    flex: "1 1 auto",
                    flexDirection: "column",
                    minHeight: "100%",
                    width: "100%",
                },
                "#__next": {
                    display: "flex",
                    flex: "1 1 auto",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                },
                "#nprogress": {
                    pointerEvents: "none",
                },
                "#nprogress .bar": {
                    backgroundColor: palette.primary.main,
                    height: 3,
                    left: 0,
                    position: "fixed",
                    top: 0,
                    width: "100%",
                    zIndex: 2000,
                },
                "&.MuiFormLabel-asterisk": {
                    color: palette.error.main,
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    "&::placeholder": {
                        opacity: 1,
                    },
                },
            },
        },
        MuiInput: {
            styleOverrides: {
                input: {
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: "24px",
                    "&::placeholder": {
                        color: palette.text.secondary,
                    },
                },
            },
        },
        MuiFilledInput: {
            styleOverrides: {
                root: {
                    backgroundColor: "transparent",
                    borderRadius: 8,
                    borderStyle: "solid",
                    borderWidth: 1,
                    overflow: "hidden",
                    borderColor: palette.neutral[300],
                    transition: muiTheme.transitions.create([
                        "border-color",
                        "box-shadow",
                    ]),
                    "&:hover": {
                        backgroundColor: palette.action.hover,
                    },
                    "&:before": {
                        display: "none",
                    },
                    "&:after": {
                        display: "none",
                    },
                    [`&.${filledInputClasses.disabled}`]: {
                        backgroundColor: "transparent",
                    },
                    [`&.${filledInputClasses.focused}`]: {
                        backgroundColor: "transparent",
                        borderColor: palette.primary.main,
                        boxShadow: `${palette.primary.main} 0 0 0 2px`,
                    },
                    [`&.${filledInputClasses.error}`]: {
                        borderColor: palette.error.main,
                        boxShadow: `${palette.error.main} 0 0 0 2px`,
                    },
                },
                input: {
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: "24px",
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    "&:hover": {
                        backgroundColor: palette.action.hover,
                        [`& .${outlinedInputClasses.notchedOutline}`]: {
                            borderColor: palette.neutral[300],
                        },
                    },
                    [`&.${outlinedInputClasses.focused}`]: {
                        backgroundColor: "transparent",
                        [`& .${outlinedInputClasses.notchedOutline}`]: {
                            borderColor: palette.primary.main,
                            boxShadow: `${palette.primary.main} 0 0 0 2px`,
                        },
                    },
                    [`&.${filledInputClasses.error}`]: {
                        [`& .${outlinedInputClasses.notchedOutline}`]: {
                            borderColor: palette.error.main,
                            boxShadow: `${palette.error.main} 0 0 0 2px`,
                        },
                    },
                },
                input: {
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: "24px",
                },
                notchedOutline: {
                    borderColor: palette.neutral[300],
                    transition: muiTheme.transitions.create([
                        "border-color",
                        "box-shadow",
                    ]),
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    fontSize: 14,
                    fontWeight: 500,
                    [`&.${inputLabelClasses.filled}`]: {
                        transform: "translate(12px, 18px) scale(1)",
                    },
                    [`&.${inputLabelClasses.shrink}`]: {
                        [`&.${inputLabelClasses.standard}`]: {
                            transform: "translate(0, -1.5px) scale(0.85)",
                        },
                        [`&.${inputLabelClasses.filled}`]: {
                            transform: "translate(12px, 6px) scale(0.85)",
                        },
                        [`&.${inputLabelClasses.outlined}`]: {
                            transform: "translate(14px, -9px) scale(0.85)",
                        },
                    },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: 1.71,
                    minWidth: "auto",
                    paddingLeft: 0,
                    paddingRight: 0,
                    textTransform: "none",
                    "& + &": {
                        marginLeft: 24,
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottomColor: palette.divider,
                    padding: "15px 16px",
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    borderBottom: "none",
                    [`& .${tableCellClasses.root}`]: {
                        borderBottom: "none",
                        backgroundColor: palette.divider,
                        color: palette.neutral[700],
                        fontSize: 12,
                        fontWeight: 600,
                        lineHeight: 1,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                    },
                    [`& .${tableCellClasses.paddingCheckbox}`]: {
                        paddingTop: 4,
                        paddingBottom: 4,
                    },
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: "filled",
            },
        },
        MuiTypography: {
            defaultProps: {
                variantMapping: {
                    h1: "h2",
                    h2: "h2",
                    h3: "h2",
                    h4: "h2",
                    h5: "h2",
                    h6: "h2",
                    subtitle1: "h2",
                    subtitle2: "h2",
                    body1: "span",
                    body2: "span",
                },
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    "&:not(:last-child)": {
                        marginBottom: "16px",
                    },
                    "&.Mui-expanded": {
                        marginBottom: "16px",
                        marginTop: "0",
                    },
                    "&:before": {
                        display: "none",
                    },
                    "&:last-of-type": {
                        borderBottomRightRadius: 20,
                        borderBottomLeftRadius: 20,
                    },
                },
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    flexDirection: "row-reverse",
                    backgroundColor: palette.divider,
                    padding: "0 20px",
                    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                        transform: "rotate(90deg)",
                    },
                    "&.Mui-expanded": {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                    },
                },
            },
        },
        MuiAccordionDetails: {
            styleOverrides: {
                root: {
                    padding: 0,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                },
            },
        },
        MuiBreadcrumbs: {
            styleOverrides: {
                root: {
                    "& .MuiBreadcrumbs-separator": {
                        marginLeft: "12px",
                        marginRight: "12px",
                        fontSize: "3rem",
                        color: palette.text.primary,
                    },
                    "& .MuiBreadcrumbs-ol": {
                        lineHeight: "0.75",
                    },
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderBottomWidth: "medium",
                },
            },
        },
        MuiSkeleton: {
            styleOverrides: {
                root: {
                    maxWidth: "initial",
                },
            },
        },
        MuiGrid2: {
            styleOverrides: {
                root: {
                    "--Grid-columnSpacing1": "12px",
                    "--Grid-rowSpacing1": "12px",
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: "rgba(0, 0, 0, 0.88)",
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.06)",
                    },
                },
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    "& .MuiAutocomplete-tag": {
                        marginBottom: "12px",
                        marginTop: "10px",
                    },
                },
            },
        },
    };
}
