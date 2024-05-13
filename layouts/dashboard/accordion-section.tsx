import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
    Button,
    Grid,
    SvgIcon,
} from "@mui/material";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import PlusIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useState } from "react";

const AccordionSection = ({
    summary,
    summaryVariant,
    children,
    handleAdd,
    addLabel,
    isDisabled,
    isExpanded,
    canEdit,
}: any) => {
    const handleAddAccordion = (e: any) => {
        e.stopPropagation();
        handleAdd();
    };

    const [expanded, setExpanded] = useState(true);

    const handleChange = () => {
        setExpanded(!expanded);
    };

    return (
        <Accordion
            expanded={isExpanded !== undefined ? isExpanded : expanded}
            onChange={handleChange}
        >
            <AccordionSummary
                expandIcon={
                    <ArrowForwardIosSharpIcon
                        sx={{
                            fontSize: "1.2rem",
                            color: "primary.main",
                        }}
                    />
                }
            >
                <Grid container ml={1.5}>
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant={summaryVariant || "h5"}
                            sx={{
                                color: "primary.main",
                            }}
                        >
                            {summary}
                        </Typography>
                    </Grid>
                    {expanded &&
                        handleAdd &&
                        typeof handleAdd === "function" &&
                        canEdit && (
                            <Grid item xs={12} sm={6} sx={{ textAlign: "end" }}>
                                <Button
                                    onClick={handleAddAccordion}
                                    startIcon={
                                        <SvgIcon fontSize="small">
                                            <PlusIcon />
                                        </SvgIcon>
                                    }
                                    sx={{}}
                                    variant="contained"
                                    disabled={
                                        isDisabled !== undefined
                                            ? isDisabled
                                            : false
                                    }
                                >
                                    Thêm {addLabel}
                                </Button>
                            </Grid>
                        )}
                </Grid>
            </AccordionSummary>
            <AccordionDetails>{children}</AccordionDetails>
        </Accordion>
    );
};

export default AccordionSection;
