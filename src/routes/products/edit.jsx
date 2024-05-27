import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductActions } from "../../redux/actions";
import { PlusIcon, SearchIcon } from "../../icons/index";
import { Link } from "react-router-dom";
import Loader from "../../components/loader";
import Popup from "reactjs-popup";
import { store } from "../../redux";

const ProductComponent = () => {
    const [searchProduct, setSearchProduct] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const itemsPerPage = 10

    const [isEdit, setIsEdit] = useState(false);
    const [id, setId] = useState(null);
    const [product, setProduct] = useState({
        _id: "",
        name: "",
        quantity: "",
        lowStock: "",
        costPrice: "",
        sellingPrice: "",
        additionalNotes: "",
    });

    const dispatch = useDispatch();
    const state = useSelector((state) => state);
    if (Object.keys(state?.product.product).length === 0) {
        dispatch(ProductActions.readProduct())
    }




    const products = state.product.product;
    const isLoading = state.product.isLoading;

    const truncate = (str, n) => {
        return str?.length > n ? str?.substr(0, n - 1) + "..." : str;
    };

    const [filteredData, setFilteredData] = useState([]);
    useEffect(() => {
        if (searchProduct?.length > 0) {
            Object.keys(products).length > 0 && setFilteredData(products?.filter(({ name, additionalNotes }) => {
                return name?.toLowerCase()?.includes(searchProduct?.toLowerCase()) || additionalNotes?.toLowerCase()?.includes(searchProduct?.toLowerCase());
            }));
        } else {
            setFilteredData(products);
        }
    }, [products, searchProduct])


    const handleDelete = (id) => {
        dispatch(ProductActions.deleteProduct(id));
        setIsEdit(false)
    }
    // Sorting function
    const handleSort = (columnName) => {
        if (sortBy === columnName) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(columnName);
            setSortOrder("asc");
        }
    };

    // Paginate function
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Sorting logic
    let sortedData = Object.keys(filteredData).length > 0 ? [...filteredData] : [];
    if (sortBy) {
        sortedData.sort((a, b) => {
            if (sortOrder === "asc") {
                return a[sortBy] > b[sortBy] ? 1 : -1;
            } else {
                return a[sortBy] < b[sortBy] ? 1 : -1;
            }
        });
    }

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    return (
        <div className="mt-auto xl:w-10/12 w-full h-full p-4 py-14 lg:p-10 bg-gray-50 ml-auto">

            <div className=" mt-auto   w-full h-full  bg-gray-50  flex flex-col gap-3">
                <p className="text-4xl mt-10 font-medium text-gray-900">Products</p>
                <div className="flex flex-col gap-5 lg:flex-row justify-between items-stretch">
                    <div className="flex space-x-1 items-stretch">
                        <input
                            value={searchProduct}
                            onChange={(e) => setSearchProduct(e.target.value)}
                            type="search"
                            className={`w-full p-4 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out`}
                            id="search"
                            name="search_product"
                            placeholder="Search for product"
                        />
                        <button
                            type="search"
                            className={`cursor-pointer bg-primary p-4 text-sm text-white rounded-lg border focus:outline-none focus:`}
                        >
                            <SearchIcon></SearchIcon>
                        </button>
                    </div>
                    <Link to="/addproduct">
                        <button className="flex space-x-2 justify-center button lg:px-16 px-8 py-4 bg-primary hover:bg-indigo-700 transition-all rounded-lg text-sm font-medium text-center text-white">
                            <PlusIcon></PlusIcon>
                            Add a product
                        </button>
                    </Link>
                </div>
                <div className="flex flex-col h-full">
                    <div className="my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 h-full">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8 h-full">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg h-full">
                                <table className="min-w-full h-full flex-1 divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSort("Medicine")}
                                            >
                                                Medicine
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSort("instock")}
                                            >
                                                instock
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSort("costPrice")}
                                            >
                                                cost price
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSort("sellingPrice")}
                                            >
                                                selling price
                                            </th>
                                        </tr>
                                    </thead>
                                    {isLoading ? (
                                        <tbody className="bg-white divide-y divide-gray-200 h-96">
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td>
                                                    <Loader size="75" />
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    ) : (
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {currentItems?.map(
                                                ({
                                                    _id,
                                                    name,
                                                    picture,
                                                    quantity,
                                                    costPrice,
                                                    sellingPrice,
                                                    preferredVendor,
                                                    additionalNotes,
                                                }) => (
                                                    <tr key={_id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-12 w-12">
                                                                    <img
                                                                        className="h-12 w-12 rounded-lg"
                                                                        src={
                                                                            picture
                                                                                ? picture
                                                                                : "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1130&q=80"
                                                                        }
                                                                        alt="medicine pic"
                                                                    />
                                                                </div>
                                                                <div className="ml-4 uppercase">
                                                                    <div className="text-md font-medium whitespace-nowrap  text-gray-900">
                                                                        {name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {truncate(
                                                                            additionalNotes,
                                                                            30
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                isEdit &&
                                                                    _id === id ?
                                                                    <input
                                                                        type="number"
                                                                        className={`w-full lg:p-4 p-1 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out`}
                                                                        id="quantity"
                                                                        value={product.quantity}
                                                                        onChange={e =>
                                                                            setProduct(
                                                                                prev =>
                                                                                ({
                                                                                    ...prev,
                                                                                    quantity: e.target.value
                                                                                })
                                                                            )
                                                                        }
                                                                        name="quantity"
                                                                        placeholder="Quantity"
                                                                    />
                                                                    :
                                                                    <div className="text-sm text-gray-500">
                                                                        <span className={`${quantity <= 2 ? "text-red-500" : "text-gray-500"}`}>{quantity}</span>
                                                                    </div>
                                                            }
                                                        </td>

                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {
                                                                isEdit &&
                                                                    _id === id ?
                                                                    <input
                                                                        type="number"
                                                                        className={`w-full lg:p-4 p-1 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out`}
                                                                        id="costPrice"
                                                                        value={product.costPrice}
                                                                        onChange={e =>
                                                                            setProduct(
                                                                                prev =>
                                                                                ({
                                                                                    ...prev,
                                                                                    costPrice: e.target.value
                                                                                })
                                                                            )
                                                                        }
                                                                        name="costPrice"
                                                                        placeholder="Cost Price"
                                                                    />
                                                                    :
                                                                    <div className="text-sm ">

                                                                        <span className={`${quantity <= 2 ? "text-red-500" : "text-gray-500"}`}>Rs. {costPrice}</span>
                                                                    </div>
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-md  text-gray-500">
                                                            {
                                                                isEdit &&
                                                                    _id === id ?
                                                                    <input
                                                                        type="number"
                                                                        className={`w-full lg:p-4 p-1 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out`}
                                                                        id="sellingPrice"
                                                                        value={product.sellingPrice}
                                                                        onChange={e =>
                                                                            setProduct(
                                                                                prev =>
                                                                                ({
                                                                                    ...prev,
                                                                                    sellingPrice: e.target.value
                                                                                })
                                                                            )
                                                                        }
                                                                        name="sellingPrice"
                                                                        placeholder="Selling Price"
                                                                    />
                                                                    :
                                                                    <div className="text-sm text-gray-500">
                                                                        <span className={`${quantity <= 2 ? "text-red-500" : "text-gray-500"}`}>Rs. {sellingPrice}</span>
                                                                    </div>
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                                                            <Popup
                                                                trigger={
                                                                    <button className="px-6 py-3 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900 rounded-lg border">
                                                                        View
                                                                    </button>
                                                                }
                                                                modal
                                                            >
                                                                {(close) => (

                                                                    <div className="bg-white p-10 rounded-lg">
                                                                        <div className="my-2 overflow-x-auto w-full">
                                                                            <div className="py-2 align-middle inline-block min-w-full">
                                                                                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                                                                    <table className="min-w-full divide-y divide-gray-200">
                                                                                        <thead className="bg-gray-50">
                                                                                            <tr>
                                                                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                                    Product Name
                                                                                                </th>

                                                                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                                    Salts
                                                                                                </th>

                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className="bg-white divide-y divide-gray-200 uppercase">
                                                                                            <tr>
                                                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                                                    {name}
                                                                                                </td>
                                                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                                                    {additionalNotes}
                                                                                                </td>

                                                                                            </tr>

                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>



                                                                )}
                                                            </Popup>
                                                            <button
                                                                onClick={
                                                                    () => {
                                                                        if (isEdit && _id === id) {
                                                                            dispatch(ProductActions.editProduct(product))
                                                                        }
                                                                        setIsEdit(!isEdit);
                                                                        setId(_id);
                                                                        setProduct(
                                                                            {
                                                                                _id,
                                                                                name,
                                                                                quantity,
                                                                                costPrice,
                                                                                sellingPrice,
                                                                                additionalNotes,
                                                                            }
                                                                        )
                                                                    }
                                                                }
                                                                className="text-indigo-600 hover:text-indigo-900 rounded-lg border py-3 px-8"
                                                            >
                                                                {isEdit && _id === id ? "Save" : "Edit"}
                                                            </button>
                                                            {(isEdit && _id === id) && (
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={
                                                                            () => {

                                                                                setIsEdit(false);
                                                                                setId(null);
                                                                            }
                                                                        }
                                                                        className="text-indigo-600 hover:text-indigo-900 rounded-lg border py-3 px-8"
                                                                    >
                                                                        Cancel
                                                                    </button>
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
                                                                                        onClick={() => {
                                                                                            console.log("modal closed ");
                                                                                            close();
                                                                                        }}
                                                                                        className={`w-full transition-all duration-300 cursor-pointer bg-gray-100 py-2 px-4 text-sm text-primary rounded-lg border hover:bg-primary hover:text-white`}
                                                                                    >
                                                                                        Cancel
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={(() => handleDelete(id))}
                                                                                        className={`w-full transition-all duration-300 cursor-pointer bg-red-500 py-2 px-4 text-sm text-white rounded-lg border hover:bg-red-700 hover:text-white`}
                                                                                    >
                                                                                        Delete
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </Popup>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    )}
                                </table>
                                {
                                    totalPages > 1
                                    &&
                                    <div className="mt-4 flex justify-center">
                                        <nav className="bg-white rounded-md border border-gray-300">
                                            <ul className="flex">
                                                <li
                                                    className={`px-3 py-2 cursor-pointer ${currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                                                        }`}
                                                    onClick={() => handlePageChange(1)}
                                                >
                                                    First
                                                </li>
                                                {/* Previous button */}
                                                <li
                                                    className={`px-3 py-2 cursor-pointer ${currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                                                        }`}
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                >
                                                    Previous
                                                </li>


                                                {/* Page numbers */}
                                                {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                                                    const pageNumber = currentPage > 3 ? currentPage + index - 2 : index + 1;
                                                    return pageNumber <= totalPages && pageNumber > 0 ? (
                                                        <li
                                                            key={index}
                                                            className={`px-3 py-2 cursor-pointer ${currentPage === pageNumber ? "bg-gray-200" : "hover:bg-gray-100"
                                                                }`}
                                                            onClick={() => handlePageChange(pageNumber)}
                                                        >
                                                            {pageNumber}
                                                        </li>
                                                    ) : null;
                                                })}

                                                {/* Next button */}
                                                <li
                                                    className={`px-3 py-2 cursor-pointer ${currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
                                                        }`}
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                >
                                                    Next
                                                </li>
                                                {/* Last page button */}
                                                <li
                                                    className={`px-3 py-2 cursor-pointer ${currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
                                                        }`}
                                                    onClick={() => handlePageChange(totalPages)}
                                                >
                                                    Last
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                }


                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="flex flex-col">
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
                                                Medicine
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                instock
                                            </th>

                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                cost price
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                selling price
                                            </th>
                                        </tr>
                                    </thead>
                                    {isLoading ? (
                                        <tbody className="bg-white divide-y divide-gray-200 h-96">
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td>
                                                    <Loader size="75" />
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    ) : (
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {Object.keys(filteredData).length > 0 && filteredData?.map(
                                                ({
                                                    _id,
                                                    name,
                                                    picture,
                                                    quantity,
                                                    costPrice,
                                                    sellingPrice,
                                                    preferredVendor,
                                                    additionalNotes,
                                                }) => (
                                                    <tr key={_id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-12 w-12">
                                                                    <img
                                                                        className="h-12 w-12 rounded-lg"
                                                                        src={
                                                                            picture
                                                                                ? picture
                                                                                : "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1130&q=80"
                                                                        }
                                                                        alt="medicine pic"
                                                                    />
                                                                </div>
                                                                <div className="ml-4 uppercase">
                                                                    <div className="text-md font-medium whitespace-nowrap  text-gray-900">
                                                                        {name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {truncate(
                                                                            additionalNotes,
                                                                            30
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                isEdit &&
                                                                    _id === id ?
                                                                    <input
                                                                        type="number"
                                                                        className={`w-full lg:p-4 p-1 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out`}
                                                                        id="quantity"
                                                                        value={product.quantity}
                                                                        onChange={e =>
                                                                            setProduct(
                                                                                prev =>
                                                                                ({
                                                                                    ...prev,
                                                                                    quantity: e.target.value
                                                                                })
                                                                            )
                                                                        }
                                                                        name="quantity"
                                                                        placeholder="Quantity"
                                                                    />
                                                                    :
                                                                    <div className="text-sm text-gray-500">
                                                                        <span className={`${quantity <= 2 ? "text-red-500" : "text-gray-500"}`}>{quantity}</span>
                                                                    </div>
                                                            }
                                                        </td>

                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {
                                                                isEdit &&
                                                                    _id === id ?
                                                                    <input
                                                                        type="number"
                                                                        className={`w-full lg:p-4 p-1 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out`}
                                                                        id="costPrice"
                                                                        value={product.costPrice}
                                                                        onChange={e =>
                                                                            setProduct(
                                                                                prev =>
                                                                                ({
                                                                                    ...prev,
                                                                                    costPrice: e.target.value
                                                                                })
                                                                            )
                                                                        }
                                                                        name="costPrice"
                                                                        placeholder="Cost Price"
                                                                    />
                                                                    :
                                                                    <div className="text-sm ">

                                                                        <span className={`${quantity <= 2 ? "text-red-500" : "text-gray-500"}`}>Rs. {costPrice}</span>
                                                                    </div>
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-md  text-gray-500">
                                                            {
                                                                isEdit &&
                                                                    _id === id ?
                                                                    <input
                                                                        type="number"
                                                                        className={`w-full lg:p-4 p-1 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out`}
                                                                        id="sellingPrice"
                                                                        value={product.sellingPrice}
                                                                        onChange={e =>
                                                                            setProduct(
                                                                                prev =>
                                                                                ({
                                                                                    ...prev,
                                                                                    sellingPrice: e.target.value
                                                                                })
                                                                            )
                                                                        }
                                                                        name="sellingPrice"
                                                                        placeholder="Selling Price"
                                                                    />
                                                                    :
                                                                    <div className="text-sm text-gray-500">
                                                                        <span className={`${quantity <= 2 ? "text-red-500" : "text-gray-500"}`}>Rs. {sellingPrice}</span>
                                                                    </div>
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                                                            <Popup
                                                                trigger={
                                                                    <button className="px-6 py-3 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900 rounded-lg border">
                                                                        View
                                                                    </button>
                                                                }
                                                                modal
                                                            >
                                                                {(close) => (

                                                                    <div className="bg-white p-10 rounded-lg">
                                                                        <div className="my-2 overflow-x-auto w-full">
                                                                            <div className="py-2 align-middle inline-block min-w-full">
                                                                                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                                                                    <table className="min-w-full divide-y divide-gray-200">
                                                                                        <thead className="bg-gray-50">
                                                                                            <tr>
                                                                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                                    Product Name
                                                                                                </th>

                                                                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                                    Salts
                                                                                                </th>

                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className="bg-white divide-y divide-gray-200 uppercase">
                                                                                            <tr>
                                                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                                                    {name}
                                                                                                </td>
                                                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                                                    {additionalNotes}
                                                                                                </td>

                                                                                            </tr>

                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>



                                                                )}
                                                            </Popup>
                                                            <button
                                                                onClick={
                                                                    () => {
                                                                        if (isEdit && _id === id) {
                                                                            dispatch(ProductActions.editProduct(product))
                                                                        }
                                                                        setIsEdit(!isEdit);
                                                                        setId(_id);
                                                                        setProduct(
                                                                            {
                                                                                _id,
                                                                                name,
                                                                                quantity,
                                                                                costPrice,
                                                                                sellingPrice,
                                                                                additionalNotes,
                                                                            }
                                                                        )
                                                                    }
                                                                }
                                                                className="text-indigo-600 hover:text-indigo-900 rounded-lg border py-3 px-8"
                                                            >
                                                                {isEdit && _id === id ? "Save" : "Edit"}
                                                            </button>
                                                            {(isEdit && _id === id) && (
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={
                                                                            () => {

                                                                                setIsEdit(false);
                                                                                setId(null);
                                                                            }
                                                                        }
                                                                        className="text-indigo-600 hover:text-indigo-900 rounded-lg border py-3 px-8"
                                                                    >
                                                                        Cancel
                                                                    </button>
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
                                                                                        onClick={() => {
                                                                                            console.log("modal closed ");
                                                                                            close();
                                                                                        }}
                                                                                        className={`w-full transition-all duration-300 cursor-pointer bg-gray-100 py-2 px-4 text-sm text-primary rounded-lg border hover:bg-primary hover:text-white`}
                                                                                    >
                                                                                        Cancel
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={(() => handleDelete(id))}
                                                                                        className={`w-full transition-all duration-300 cursor-pointer bg-red-500 py-2 px-4 text-sm text-white rounded-lg border hover:bg-red-700 hover:text-white`}
                                                                                    >
                                                                                        Delete
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </Popup>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    )}
                                </table>
                            </div>
                        </div>
                    </div>
                </div> */}

            </div>
        </div >
    );
};


export default ProductComponent;
