import React, { useState, useEffect } from "react";
import "../../index.css";
import Popup from "reactjs-popup";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar/sidebar";
import { PlusIcon, SearchIcon } from "../../icons/index";
import { Link } from "react-router-dom";
import Loader from "../../components/loader";
import { BillActions, HomeActions } from "../../redux/actions";
import { connect, useDispatch, useSelector } from "react-redux";
import Invoice from "../../components/billing/invoice";
import { BillingService } from "../../redux/services";
import axios from "axios";
import { BASE_API_URL } from "../../redux/services/constant";

export const changeCurrentDate = (billDay, separator = "-") => {
    let newDate = new Date(billDay);
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${date}${separator}${month < 10 ? `0${month}` : `${month}`
        }${separator}${year}`;
};




const Billing = () => {
    const [searchBill, setSearchBill] = useState("");
    const [viewType, setViewType] = useState("daily"); // Default view type



    const dispatch = useDispatch();
    const state = useSelector((state) => state);

    const bills = state.bill;
    const isLoading = state.bill.isLoading;



    useEffect(() => {
        dispatch(BillActions.readBill())
    }, [dispatch]);



    const inputChange = (event) => {
        const { name, value } = event.target;
        setSearchBill(value);
    };



    const handleDelete = async (id, close) => {
        try {
            axios.delete(`${BASE_API_URL}billing/${id}`).then((res) => {
                dispatch(BillActions.readBill())
                close()
            }).catch((error) => {
                console.log(error)
            })
        } catch (error) {
            console.log(error);
            throw error;
        }


    }






    let filteredData = bills.bill;
    filteredData = filteredData.sort((a, b) =>
        new Date(b.date) - new Date(a.date)

    )



    return (
        <div>
            <Header />
            <div>
                <Sidebar place="3" />
                <div className=" mt-auto xl:w-10/12  w-full p-4 py-14 lg:p-10 h-screen bg-gray-50 ml-auto flex flex-col space-y-6">
                    <p className="text-4xl mt-10 font-medium text-gray-900">Invoices</p>
                    <div className="flex flex-col gap-5 lg:flex-row justify-between items-stretch">
                        <div className="flex space-x-1 items-stretch">
                            <input
                                value={searchBill}
                                onChange={(event) => inputChange(event)}
                                type="text"
                                name="search_bill"
                                className={`w-full p-4 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out`}
                                id="search"
                                placeholder="Search for Invoice"
                            />
                            <button
                                type="search"
                                className={`cursor-pointer bg-primary p-4 text-sm text-white rounded-lg border focus:outline-none focus:`}
                            >
                                <SearchIcon></SearchIcon>
                            </button>
                        </div>
                        <Link to="/addbill">
                            <button className="flex space-x-2 justify-center button lg:px-16 px-8 py-4 bg-primary hover:bg-indigo-700 transition-all rounded-lg text-sm font-medium text-center text-white">
                                <PlusIcon></PlusIcon>
                                Add a bill
                            </button>
                        </Link>
                    </div>

                    <div className="my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                total amount
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                date
                                            </th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">View</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    {isLoading ? (
                                        <Loader color="#8776EE" />
                                    ) : (
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredData?.map((bill) => (
                                                <tr key={bill._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {bill.total.toFixed(2)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm ">
                                                        {changeCurrentDate(bill.date)}
                                                    </td>
                                                    <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center gap-2 ">
                                                        <Popup
                                                            trigger={
                                                                <button className="px-6 py-3 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900 rounded-lg border">
                                                                    View
                                                                </button>
                                                            }
                                                            modal
                                                           
                                                        >
                                                            {(close) => (
                                                                <Invoice
                                                                    name={bill.phoneNumber}
                                                                    totalAmount={bill.total}
                                                                    discount={bill?.discount}
                                                                    date={changeCurrentDate(bill.date)}
                                                                    products={bill.products}
                                                                ></Invoice>
                                                            )}
                                                        </Popup>
                                                        <Popup
                                                            trigger={
                                                                <button className="px-6 py-3 whitespace-nowrap text-sm text-red-600 hover:text-indigo-900 rounded-lg border">
                                                                    Delete
                                                                </button>
                                                            }
                                                            contentStyle={{
                                                                width: "30%",
                                                            }}
                                                            modal
                                                        >
                                                            {(close) => (
                                                                <div className="p-8 rounded-xl flex space-y-2 flex-col">
                                                                    <h1 className="text-xl font-bold">Are you sure?</h1>
                                                                    <h2 className="text-md font-medium text-subtle">
                                                                        Do you really want to delete this invoice? This process cannot be undone.
                                                                    </h2>
                                                                    <div className="flex space-x-2">
                                                                        <button
                                                                            onClick={() => close()}
                                                                            className={`w-full transition-all duration-300 cursor-pointer bg-gray-100 py-2 px-4 text-sm text-primary rounded-lg border hover:bg-primary hover:text-white`}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDelete(bill._id, close)}
                                                                            className={`w-full transition-all duration-300 cursor-pointer bg-red-500 py-2 px-4 text-sm text-white rounded-lg border hover:bg-red-700 hover:text-white`}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Popup>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    )}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Billing;
