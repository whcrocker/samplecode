/**
 * Class based component for the live data table.  This table allows for new rows to be created,
 * existing rows to be deleted, and existing rows to be modified.
 *
 * Author: Henry Crocker
 */
import React, { Component, Fragment } from "react";
import MaterialTable from "material-table";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {
    computeDays,
    getSkuData,
    savePointsData,
    deletePointsData,
    updatePointsData,
    loadPointsData
} from "../helpers/utils";

class PointsDataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    field: "id",
                    editable: "never",
                    export: false,
                    hidden: true
                },
                {
                    title: "SKU ID",
                    field: "skuId",
                    editable: "never",
                    export: false,
                    hidden: true
                },
                {
                    title: "SKU",
                    field: "sku",
                    editable: "onAdd",
                    export: true
                },
                {
                    title: "SKU Name",
                    field: "skuName",
                    editable: "never",
                    export: true
                },
                {
                    title: "Points",
                    field: "points",
                    type: "numeric",
                    editable: "always",
                    export: true
                },
                {
                    title: "Start Date",
                    field: "startDate",
                    type: "date",
                    export: true
                },
                {
                    title: "End Date",
                    field: "endDate",
                    type: "date",
                    export: true
                },
                {
                    title: "Days",
                    field: "days",
                    type: "numeric",
                    editable: "never",
                    export: false,
                    render: rowData =>
                        computeDays(
                            rowData ? rowData.startDate : null,
                            rowData ? rowData.endDate : null
                        )
                },
                {
                    title: "Notes",
                    field: "notes",
                    type: "string",
                    editable: "always",
                    export: true
                }
            ],
            data: [],
            toastOpen: false,
            toastMessage: ""
        };
    }

    async componentDidMount() {
        const data = await loadPointsData();

        this.setState(prevState => {
            if (data) {
                return {
                    ...prevState,
                    data
                };
            } else {
                const msg = "Initial data load failed.";
                this.setState(prevState => {
                    return {
                        ...prevState,
                        toastMessage: msg,
                        toastOpen: true
                    };
                });
            }
        });
    }

    handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        this.setState(prevState => {
            return { ...prevState, toastOpen: false, toastMessage: "" };
        });
    };

    render() {
        return (
            <Fragment>
                <MaterialTable
                    title=""
                    columns={this.state.columns}
                    data={this.state.data}
                    editable={{
                        onRowAdd: newData => {
                            return new Promise(async (resolve, reject) => {
                                if (!newData.points || newData.points <= 0) {
                                    const msg =
                                        "The points value must be greater than zero.";
                                    this.setState(prevState => {
                                        return {
                                            ...prevState,
                                            toastMessage: msg,
                                            toastOpen: true
                                        };
                                    });
                                    reject(msg);
                                } else if (!newData.startDate) {
                                    const msg = "Start Date is required.";
                                    this.setState(prevState => {
                                        return {
                                            ...prevState,
                                            toastMessage: msg,
                                            toastOpen: true
                                        };
                                    });
                                    reject(msg);
                                } else if (!newData.endDate) {
                                    const msg = "End Date is required.";
                                    this.setState(prevState => {
                                        return {
                                            ...prevState,
                                            toastMessage: msg,
                                            toastOpen: true
                                        };
                                    });
                                    reject(msg);
                                } else if (
                                    newData.endDate <= newData.startDate
                                ) {
                                    const msg =
                                        "End Date must occur after Start Date.";
                                    this.setState(prevState => {
                                        return {
                                            ...prevState,
                                            toastMessage: msg,
                                            toastOpen: true
                                        };
                                    });
                                    reject(msg);
                                } else {
                                    if (!newData.sku) {
                                        const msg = "SKU value is required.";
                                        this.setState(prevState => {
                                            return {
                                                ...prevState,
                                                toastMessage: msg,
                                                toastOpen: true
                                            };
                                        });
                                        reject(msg);
                                    } else {
                                        const skuData = await getSkuData(
                                            newData.sku
                                        );

                                        if (skuData.error) {
                                            const msg =
                                                "An error occurred while looking up SKU data: " +
                                                skuData.error;
                                            this.setState(prevState => {
                                                return {
                                                    ...prevState,
                                                    toastMessage: msg,
                                                    toastOpen: true
                                                };
                                            });
                                            reject(msg);
                                        } else {
                                            newData.skuId = skuData.data._id;
                                            newData.skuName =
                                                skuData.data.skuName;

                                            const pointsData = await savePointsData(
                                                JSON.stringify({
                                                    startDate:
                                                        newData.startDate,
                                                    endDate: newData.endDate,
                                                    points: newData.points,
                                                    notes: newData.notes,
                                                    sku: newData.skuId
                                                })
                                            );

                                            if (pointsData.data) {
                                                newData.id =
                                                    pointsData.data._id;
                                                this.setState(prevState => {
                                                    const data = [
                                                        ...prevState.data
                                                    ];
                                                    data.push(newData);
                                                    return {
                                                        ...prevState,
                                                        data
                                                    };
                                                });
                                                this.setState(prevState => {
                                                    return {
                                                        ...prevState,
                                                        toastMessage:
                                                            "Row was successfully added.",
                                                        toastOpen: true
                                                    };
                                                });
                                                resolve();
                                            } else {
                                                const msg =
                                                    "An error occurred while saving Points data: " +
                                                    pointsData.error;
                                                this.setState(prevState => {
                                                    return {
                                                        ...prevState,
                                                        toastMessage: msg,
                                                        toastOpen: true
                                                    };
                                                });
                                                reject(msg);
                                            }
                                        }
                                    }
                                }
                            });
                        },
                        onRowUpdate: (newData, oldData) =>
                            new Promise(async (resolve, reject) => {
                                if (!newData.points || newData.points <= 0) {
                                    const msg =
                                        "The points value must be greater than zero.";
                                    this.setState(prevState => {
                                        return {
                                            ...prevState,
                                            toastMessage: msg,
                                            toastOpen: true
                                        };
                                    });
                                    reject(msg);
                                } else if (!newData.startDate) {
                                    const msg = "Start Date is required.";
                                    this.setState(prevState => {
                                        return {
                                            ...prevState,
                                            toastMessage: msg,
                                            toastOpen: true
                                        };
                                    });
                                    reject(msg);
                                } else if (!newData.endDate) {
                                    const msg = "End Date is required.";
                                    this.setState(prevState => {
                                        return {
                                            ...prevState,
                                            toastMessage: msg,
                                            toastOpen: true
                                        };
                                    });
                                    reject(msg);
                                } else if (
                                    newData.endDate <= newData.startDate
                                ) {
                                    const msg =
                                        "End Date must occur after Start Date.";
                                    this.setState(prevState => {
                                        return {
                                            ...prevState,
                                            toastMessage: msg,
                                            toastOpen: true
                                        };
                                    });
                                    reject(msg);
                                } else {
                                    const pointsData = await updatePointsData(
                                        oldData.id,
                                        JSON.stringify({
                                            startDate: newData.startDate,
                                            endDate: newData.endDate,
                                            points: newData.points,
                                            notes: newData.notes
                                        })
                                    );

                                    if (pointsData.data) {
                                        this.setState(prevState => {
                                            const data = [...prevState.data];
                                            data[
                                                data.indexOf(oldData)
                                            ] = newData;
                                            return { ...prevState, data };
                                        });
                                        const msg = `Points data with ID ${pointsData.data._id} has been updated.`;
                                        this.setState(prevState => {
                                            return {
                                                ...prevState,
                                                toastMessage: msg,
                                                toastOpen: true
                                            };
                                        });
                                        resolve(msg);
                                    } else {
                                        const msg =
                                            "An error occurred while updating Points data: " +
                                            pointsData.error;
                                        this.setState(prevState => {
                                            return {
                                                ...prevState,
                                                toastMessage: msg,
                                                toastOpen: true
                                            };
                                        });
                                        reject(msg);
                                    }
                                }
                            }),
                        onRowDelete: oldData =>
                            new Promise(async (resolve, reject) => {
                                const pointsData = await deletePointsData(
                                    oldData.id
                                );

                                if (pointsData.data) {
                                    this.setState(prevState => {
                                        const data = [...prevState.data];
                                        data.splice(data.indexOf(oldData), 1);
                                        return { ...prevState, data };
                                    });
                                    const msg = `Points data with ID ${pointsData.data._id} has been deleted.`;
                                    this.setState(prevState => {
                                        return {
                                            ...prevState,
                                            toastMessage: msg,
                                            toastOpen: true
                                        };
                                    });
                                    resolve(msg);
                                } else {
                                    const msg = `An error occurred while deleting Points data: ${pointsData.error}`;
                                    this.setState(prevState => {
                                        return {
                                            ...prevState,
                                            toastMessage: msg,
                                            toastOpen: true
                                        };
                                    });
                                    reject(msg);
                                }
                            })
                    }}
                    options={{
                        exportButton: true,
                        exportAllData: true,
                        padding: "dense",
                        searchFieldAlignment: "left",
                        showTitle: false
                    }}
                    actions={[
                        {
                            icon: "refresh",
                            tooltip: "Refresh",
                            isFreeAction: true,
                            onClick: async () => {
                                const data = await loadPointsData();

                                this.setState(prevState => {
                                    if (data) {
                                        return {
                                            ...prevState,
                                            data
                                        };
                                    } else {
                                        const msg = "Refresh failed.";
                                        this.setState(prevState => {
                                            return {
                                                ...prevState,
                                                toastMessage: msg,
                                                toastOpen: true
                                            };
                                        });
                                    }
                                });
                            }
                        }
                    ]}
                />
                <Snackbar
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left"
                    }}
                    open={this.state.toastOpen}
                    autoHideDuration={5000}
                    onClose={this.handleClose}
                    message={this.state.toastMessage}
                    action={
                        <React.Fragment>
                            <IconButton
                                size="small"
                                aria-label="close"
                                color="inherit"
                                onClick={this.handleClose}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </React.Fragment>
                    }
                />
            </Fragment>
        );
    }
}

export default PointsDataTable;
