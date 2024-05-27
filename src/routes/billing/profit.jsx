import React, { useEffect, useState } from 'react'
import Header from '../../components/header'
import Sidebar from '../../components/sidebar/sidebar'
import { useDispatch, useSelector } from 'react-redux';
import { BillActions, ProductActions } from '../../redux/actions';
import Popup from 'reactjs-popup';
import { changeCurrentDate } from './billing';



const calculateDailySales = (bills, products) => {
    const dailySales = {};

    bills.sort((a, b) =>
        new Date(b.date) - new Date(a.date)

    ).forEach(bill => {
        const date = changeCurrentDate(bill.date, "/");
        if (!dailySales[date]) {
            dailySales[date] = { totalSales: 0, totalProfit: 0, entries: [] };
        }
        const profit = calculateProfit(bill, products);
        dailySales[date].totalSales += bill.total;
        dailySales[date].totalProfit += profit;
        dailySales[date].entries.push(
            {
                bill: bill.products.map(item => {
                    const product = Object.keys(products).length > 0 && products?.find((product) => product.name === item.productName);
                   
                    return {
                        ...item,
                        actualPrice: product?.costPrice,
                        sellingPrice: product?.sellingPrice
                    }
                }
                ),
                discount:bill?.discount
            }
        );
    });

    return dailySales;
};

const calculateMonthlySales = (bills, products) => {
    const monthlySales = {};

    bills.sort((a, b) =>
        new Date(b.date) - new Date(a.date)

    ).forEach(bill => {
        const date = new Date(bill.date);
        const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (!monthlySales[yearMonth]) {
            monthlySales[yearMonth] = { totalSales: 0, totalProfit: 0, entries: [] };
        }
        const profit = calculateProfit(bill, products);
        monthlySales[yearMonth].totalSales += bill.total;
        monthlySales[yearMonth].totalProfit += profit;
        monthlySales[yearMonth].entries.push(
            {
                bill: bill.products.map(item => {
                
                    const product = Object.keys(products).length > 0 && products?.find((product) => product.name === item.productName);
            
                    return {
                        ...item,
                        actualPrice: product?.costPrice,
                        sellingPrice: product?.sellingPrice
                    }
                }
                ),
                discount:bill?.discount

            }
        );
    });

    return monthlySales;
};
const calculateProfit = (bill, products) => {
    // Assuming bill object has properties: total (total revenue) and products (array of products in the bill)
    const revenue = bill.total;

    // Calculate total cost based on products in the bill and their respective actual prices
    let totalCost = 0;
    bill.products?.forEach((item) => {
        const product = Object.keys(products).length > 0 && products?.find((product) => product.name === item.productName);
        if (product) {
            totalCost += item.quantity * product.costPrice;
        }
    });

    // Calculate profit
    const profit = revenue - totalCost;
    return profit;
};



const Profit = () => {

    const [viewType, setViewType] = useState("daily"); // Default view type



    const dispatch = useDispatch();




    useEffect(() => {
        dispatch(BillActions.readBill())
        dispatch(ProductActions.readProduct())
    }, [dispatch]);

    const state = useSelector((state) => state);

    const bills = state.bill;
    const products = state.product;
    const isLoading = state.bill.isLoading;

    const handleViewTypeChange = (type) => {
        setViewType(type);
    };





    let salesData = [];

    if (viewType === "daily") {
        salesData = calculateDailySales(bills.bill, products.product);
        console.log(salesData)
    } else if (viewType === "monthly") {
        salesData = calculateMonthlySales(bills.bill, products.product);
    }



    return (
        <div>
            <Header />
            <div>
                <Sidebar place="5" />
                <div className=" mt-auto xl:w-10/12 w-full p-4 py-14 lg:p-10 h-screen bg-gray-50 ml-auto flex flex-col space-y-6">
                    <p className="text-4xl mt-10 font-medium text-gray-900">Profit</p>
                    <div className="w-full flex flex-col gap-5 lg:flex-row justify-between items-stretch">
                        <div className='w-full flex flex-col gap-4'>
                            <label className="text-sm font-medium text-gray-700">View Type:</label>
                            <select
                                value={viewType}
                                onChange={(event) => handleViewTypeChange(event.target.value)}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="daily">Daily</option>
                                <option value="monthly">Monthly</option>
                            </select>
                            <div className="my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Total Sales
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Total Profit
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {Object.keys(salesData).map((date) => (
                                                    <tr key={date}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {date}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {salesData[date].totalSales.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {salesData[date].totalProfit.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            <Popup
                                                                trigger={
                                                                    <button className="px-6 py-3 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900 rounded-lg border">
                                                                        View
                                                                    </button>
                                                                }
                                                                contentStyle={{ height: "fit-content" }}
                                                                modal
                                                            >
                                                                {(close) => (
                                                                    <div className="p-4  lg:p-8  rounded-xl bg-white shadow-md">
                                                                        {/* Sales Data */}
                                                                        <h1 className="text-xl font-bold mb-4">Sales Data</h1>

                                                                        {/* Display Date, Total Sales, and Total Profit */}
                                                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                                                                            <span className="text-xl font-bold">Date: {date}</span>
                                                                            <span className="text-xl font-bold">Revenue: Rs. {salesData[date].totalSales.toFixed(2)}</span>
                                                                            <span className="text-xl font-bold">Profit: Rs. {salesData[date].totalProfit.toFixed(2)}</span>
                                                                        </div>

                                                                        {/* Breakdown of Profit for each bill */}
                                                                        <div className='h-96 w-full overflow-y-auto '>
                                                                            {salesData[date].entries.map((entry, index) => (
                                                                                <div key={index} className="my-2 overflow-x-auto w-full">
                                                                                    <div className="py-2 align-middle inline-block min-w-full">
                                                                                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                                                                            <table className="min-w-full divide-y divide-gray-200">
                                                                                                <thead className="bg-gray-50">
                                                                                                    <tr>
                                                                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                                            Product Name
                                                                                                        </th>
                                                                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                                            Quantity
                                                                                                        </th>
                                                                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                                            Actual Price
                                                                                                        </th>
                                                                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                                            Selling Price
                                                                                                        </th>
                                                                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                                            Total Cost
                                                                                                        </th>
                                                                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                                            Selling Cost
                                                                                                        </th>
                                                                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                                            Discount
                                                                                                        </th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody className="bg-white divide-y divide-gray-200">
                                                                                                    {entry.bill.map((item, index) => (
                                                                                                        <tr key={index}>
                                                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm uppercase font-medium text-gray-900">
                                                                                                                {item.productName}
                                                                                                            </td>
                                                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                                                                {item.quantity}
                                                                                                            </td>
                                                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                                                                {item.actualPrice}
                                                                                                            </td>
                                                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                                                                {item.sellingPrice}
                                                                                                            </td>
                                                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                                                                {
                                                                                                                    (item.actualPrice * item.quantity).toFixed(2)
                                                                                                                }
                                                                                                            </td>
                                                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                                                                {
                                                                                                                    (item.sellingPrice * item.quantity).toFixed(2)
                                                                                                                }
                                                                                                            </td>
                                                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                                                                {
                                                                                                                    entry.discount || 0 
                                                                                                                } %
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    ))}
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                )}

                                                            </Popup>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* <Popup
                                trigger={
                                    <button className="px-6 py-3 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900 rounded-lg border">
                                        View
                                    </button>
                                }
                                modal
                            >
                                {(close) => (
                                    <div className="p-8 rounded-xl bg-white shadow-md">
                                       
                                        <h1 className="text-xl font-bold mb-4">Sales Data</h1>

                            
                                        {Object.keys(salesData).map((date) => (
                                            <div key={date} className="mb-4">
                                      
                                                <h2 className="text-lg font-medium text-gray-800">{date}</h2>

                                               
                                                <div className="flex justify-between mb-2">
                                                    <div className="flex flex-col">
                                                        <h3 className="text-md font-medium text-gray-600">Total Sales</h3>
                                                        <h3 className="text-md font-medium text-gray-600">Total Profit</h3>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-md font-medium text-gray-800">{salesData[date].totalSales}</span>
                                                        <span className="text-md font-medium text-gray-800">{salesData[date].totalProfit}</span>
                                                    </div>
                                                </div>

                                      
                                                {salesData[date].entries.map((entry, index) => (
                                                    <div key={index} className="flex justify-between">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-gray-600">{entry.bill.productName}</span>
                                                            <span className="text-sm font-medium text-gray-600">Quantity: {entry.bill.quantity}</span>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-sm font-medium text-gray-800">Revenue: {entry.bill.total}</span>
                                                            <span className="text-sm font-medium text-gray-800">Cost: {entry.bill.totalCost}</span>
                                                            <span className="text-sm font-medium text-gray-800">Profit: {entry.profit}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}

                                       
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => close()}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300 transition-colors"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>


                                )}
                            </Popup> */}


                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Profit