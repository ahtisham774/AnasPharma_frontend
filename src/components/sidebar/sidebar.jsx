import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../index.css";
import {
    DashboardIcon,
    BoxIcon,
    FileTextIcon,
    InvoiceIcon,
    ProfitIcon,
} from "../../icons/index";
import QuickAdd from "./quickadd";



class Sidebar extends Component {
    render() {

        return (
            <>
                <div className="w-1/6 shadow mt-12 fixed h-full overflow-y-auto text-base lg:text-sm pb-4 sticky?lg:h-(screen-18) xl:block hidden">
                    <div className="inline-flex flex-col space-y-2 items-start justify-between flex-1 h-full px-6 pt-6 pb-12">
                        <div>
                            {/* <QuickAdd /> */}
                            <Link to="/dash" className="w-full">
                                <div
                                    className={
                                        "inline-flex items-center justify-start w-full h-12 pl-2 pr-16 pt-2 pb-2.5 rounded-lg " +
                                        (this.props.place === "1" ? "bg-purple-100" : "")
                                    }
                                >
                                    <div className="flex space-x-8 items-center justify-start">
                                        <DashboardIcon
                                            className="h-5 "
                                            stroke={this.props.place === "1" ? "#5E48E8" : "#8C8CA2"}
                                        />
                                        <p
                                            className={
                                                "text-sm font-medium " +
                                                (this.props.place === "1"
                                                    ? "text-indigo-600 "
                                                    : "text-gray-400")
                                            }
                                        >
                                            Dashboard
                                        </p>
                                    </div>
                                </div>
                            </Link>
                            {/* Products */}
                            <Link to="/products" className="w-full">
                                <div
                                    className={
                                        "inline-flex items-center justify-start w-full h-12 pl-2 pr-16 pt-2 pb-2.5 rounded-lg " +
                                        (this.props.place === "2" ? "bg-purple-100" : "")
                                    }
                                >
                                    <div className="inline-flex space-x-8 items-center justify-start">
                                        <BoxIcon
                                            className="h-5 "
                                            stroke={this.props.place === "2" ? "#5E48E8" : "#8C8CA2"}
                                        />
                                        <p
                                            className={
                                                "text-sm font-medium " +
                                                (this.props.place === "2"
                                                    ? "text-indigo-600 "
                                                    : "text-gray-400")
                                            }
                                        >
                                            Products
                                        </p>
                                    </div>
                                </div>
                            </Link>
                            <Link to="/billing" className="w-full">
                                <div
                                    className={
                                        "inline-flex items-center justify-start w-full h-12 pl-2 pr-16 pt-2 pb-2.5 rounded-lg " +
                                        (this.props.place === "3" ? "bg-purple-100" : "")
                                    }
                                >
                                    <div className="inline-flex space-x-8 items-center justify-start">
                                        <InvoiceIcon
                                            className="h-5 w-5"
                                            stroke={this.props.place === "3" ? "#5E48E8" : "#8C8CA2"}
                                        />
                                        <p
                                            className={
                                                "text-sm font-medium " +
                                                (this.props.place === "3"
                                                    ? "text-indigo-600 "
                                                    : "text-gray-400")
                                            }
                                        >
                                            Invoices
                                        </p>
                                    </div>
                                </div>
                            </Link>
                            {/* vendors */}
                            <Link to="/addbill" className="w-full">
                                <div
                                    className={
                                        "inline-flex items-center justify-start w-full h-12 pl-2 pr-16 pt-2 pb-2.5 rounded-lg " +
                                        (this.props.place === "4" ? "bg-purple-100" : "")
                                    }
                                >
                                    <div className="inline-flex space-x-8 items-center justify-start">
                                        <FileTextIcon
                                            className="h-5 "
                                            stroke={this.props.place === "4" ? "#5E48E8" : "#8C8CA2"}
                                        />
                                        <p
                                            className={
                                                "text-sm font-medium " +
                                                (this.props.place === "4"
                                                    ? "text-indigo-600 "
                                                    : "text-gray-400")
                                            }
                                        >
                                            Billing
                                        </p>
                                    </div>
                                </div>
                            </Link>
                            <Link to="/profit" className="w-full">
                                <div
                                    className={
                                        "inline-flex items-center justify-start w-full h-12 pl-2 pr-16 pt-2 pb-2.5 rounded-lg " +
                                        (this.props.place === "5" ? "bg-purple-100" : "")
                                    }
                                >
                                    <div className="inline-flex space-x-8 items-center justify-start">
                                        <ProfitIcon
                                            className="h-5 w-5"
                                            stroke={this.props.place === "5" ? "#5E48E8" : "#8C8CA2"}
                                        />
                                        <p
                                            className={
                                                "text-sm font-medium " +
                                                (this.props.place === "5"
                                                    ? "text-indigo-600 "
                                                    : "text-gray-400")
                                            }
                                        >
                                            Profit
                                        </p>
                                    </div>
                                </div>
                            </Link>


                        </div>


                    </div>
                </div>
                <div class="fixed xl:hidden bottom-0 left-0 z-50 w-full h-16  backdrop-blur-xl bg-white border-t border-gray-200">
                    <div class="flex items-center justify-between px-6 py-3 text-gray-500">
                        <Link to="/dash" >
                            <div
                                className={
                                    "inline-flex  items-center justify-start  h-12 p-4 rounded-lg " +
                                    (this.props.place === "1" ? "bg-purple-100" : "")
                                }
                            >
                                <div className="flex flex-col  items-center justify-center text-center">
                                    <DashboardIcon
                                        className="h-5 "
                                        stroke={this.props.place === "1" ? "#5E48E8" : "#8C8CA2"}
                                    />
                                    <p
                                        className={
                                            "text-sm font-medium menuText " +
                                            (this.props.place === "1"
                                                ? "text-indigo-600 "
                                                : "text-gray-400")
                                        }
                                    >
                                        Dashboard
                                    </p>
                                </div>
                            </div>
                        </Link>
                        {/* Products */}
                        <Link to="/products" >
                            <div
                                className={
                                   "inline-flex  items-center justify-start  h-12 p-4 rounded-lg " +
                                    (this.props.place === "2" ? "bg-purple-100" : "")
                                }
                            >
                               <div className="flex flex-col  items-center justify-center text-center">
                                    <BoxIcon
                                        className="h-5 "
                                        stroke={this.props.place === "2" ? "#5E48E8" : "#8C8CA2"}
                                    />
                                    <p
                                        className={
                                            "text-sm font-medium menuText " +
                                            (this.props.place === "2"
                                                ? "text-indigo-600 "
                                                : "text-gray-400")
                                        }
                                    >
                                        Products
                                    </p>
                                </div>
                            </div>
                        </Link>
                        <Link to="/billing" >
                            <div
                                className={
                                   "inline-flex  items-center justify-start  h-12 p-4 rounded-lg " +
                                    (this.props.place === "3" ? "bg-purple-100" : "")
                                }
                            >
                               <div className="flex flex-col  items-center justify-center text-center">
                                    <InvoiceIcon
                                        className="h-5 w-5"
                                        stroke={this.props.place === "3" ? "#5E48E8" : "#8C8CA2"}
                                    />
                                    <p
                                        className={
                                            "text-sm font-medium menuText " +
                                            (this.props.place === "3"
                                                ? "text-indigo-600 "
                                                : "text-gray-400")
                                        }
                                    >
                                        Invoices
                                    </p>
                                </div>
                            </div>
                        </Link>
                        {/* vendors */}
                        <Link to="/addbill" >
                            <div
                                className={
                                   "inline-flex  items-center justify-start  h-12 p-4 rounded-lg " +
                                    (this.props.place === "4" ? "bg-purple-100" : "")
                                }
                            >
                              <div className="flex flex-col  items-center justify-center text-center">
                                    <FileTextIcon
                                        className="h-5 "
                                        stroke={this.props.place === "4" ? "#5E48E8" : "#8C8CA2"}
                                    />
                                    <p
                                        className={
                                            "text-sm font-medium menuText " +
                                            (this.props.place === "4"
                                                ? "text-indigo-600 "
                                                : "text-gray-400")
                                        }
                                    >
                                        Billing
                                    </p>
                                </div>
                            </div>
                        </Link>
                        <Link to="/profit" >
                            <div
                                className={
                                   "inline-flex  items-center justify-start  h-12 p-4 rounded-lg " +
                                    (this.props.place === "5" ? "bg-purple-100" : "")
                                }
                            >
                               <div className="flex flex-col  items-center justify-center text-center">
                                    <ProfitIcon
                                        className="h-5 w-5"
                                        stroke={this.props.place === "5" ? "#5E48E8" : "#8C8CA2"}
                                    />
                                    <p
                                        className={
                                            "text-sm font-medium menuText " +
                                            (this.props.place === "5"
                                                ? "text-indigo-600 "
                                                : "text-gray-400")
                                        }
                                    >
                                        Profit
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </>
        );
    }
}

export default Sidebar;
