import React from "react";
import { connect } from "react-redux";
import { ProductActions } from ".././redux/actions";
import { PlusIcon } from ".././icons/index";
import { Link } from "react-router-dom";
import { SearchIcon } from ".././icons/index";
import Loader from "./loader";
import { store } from ".././redux";
import Popup from "reactjs-popup";
class ProductComponent extends React.Component {
    componentDidMount() {
        this.props.loadData();
    }

    constructor(props) {
        super(props);
        this.state = {
            search_product: "",
            isEdit: false,
            id: null,
            name: "",
            quantity: 0,
            lowStock: 0,
            costPrice: 0,
            sellingPrice: 0,
            additionalNotes: "",
        };
    }

    inputChange = (event) => {
        const { name, value } = event.target;
        console.log(event.target.value, event.target.name);
        this.setState({ [name]: value });
    };
    truncate(str, n) {
        return str.length > n ? str.substr(0, n - 1) + "..." : str;
    }

    render() {
        let filteredData = [];
        const products = this.props.products ? this.props.products : [];
        if (this.state.search_product.length > 0) {
            filteredData = [];
            filteredData = products.filter(({ name, additionalNotes }) => {

            });
        } else {
            filteredData = [];
            filteredData = products;
        }

        return (
            <div className="mt-auto xl:w-10/12 w-full p-10 bg-gray-50 ml-auto">
                <div className="mt-8"></div>
                {/* top search bar */}
                <div className="flex justify-between items-stretch">
                    {/* search box */}
                    <div className="flex space-x-1 items-stretch">
                        <input
                            value={this.state.search_product}
                            onChange={(e) => this.inputChange(e)}
                            type="search"
                            className={`w-full lg:p-4 p-1 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out`}
                            id="search"
                            name="search_product"
                            placeholder="Search for product"
                        />
                        <button
                            type="search"
                            className={`cursor-pointer bg-primary lg:p-4 p-1 text-sm text-white rounded-lg border focus:outline-none focus:`}
                        >
                            <SearchIcon></SearchIcon>
                        </button>
                    </div>
                  
                    <Link to="/addproduct">
                        <button className="flex space-x-2 justify-center button lg:px-16 lg:py-4 py-2 px-4 bg-indigo-600 rounded-lg text-sm font-medium text-center text-white">
                            <PlusIcon></PlusIcon>
                            Add a product
                        </button>
                    </Link>
                </div>
                <div className="flex flex-col">
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
                                    {this.props.isLoading ? (
                                        <tbody className="bg-white divide-y divide-gray-200 h-96">
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td>
                                                    <Loader size="75" />
                                                </td>
                                                <td></td>
                                                {/* <td></td> */}
                                            </tr>
                                        </tbody>
                                    ) : (
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredData?.length > 0 && filteredData?.map(
                                                ({
                                                    _id,
                                                    name,
                                                    picture,
                                                    quantity,
                                                    costPrice,
                                                    sellingPrice,
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
                                                                <div className="ml-4">
                                                                    <div className="text-md font-medium text-gray-900">
                                                                        {name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {this.truncate(additionalNotes, 30)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                (this.state.isEdit === true && _id === this.state.id) ?
                                                                    <input
                                                                        type="number"
                                                                        className={`w-full lg:p-4 p-1 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out`}
                                                                        id="quantity"
                                                                        value={this.state.quantity}
                                                                        onChange={e =>
                                                                            this.setState({ quantity: e.target.value })
                                                                        }
                                                                        name="quantity"
                                                                        placeholder="Quantity"
                                                                    />
                                                                    :
                                                                    <div className="text-sm text-gray-500">
                                                                        {quantity}
                                                                    </div>
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {
                                                                (this.state.isEdit === true && _id === this.state.id) ?
                                                                    <input
                                                                        type="number"
                                                                        className={`w-full lg:p-4 p-1 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out`}
                                                                        id="costPrice"
                                                                        value={this.state.costPrice}
                                                                        onChange={e =>
                                                                            this.setState({ costPrice: e.target.value })
                                                                        }
                                                                        name="costPrice"
                                                                        placeholder="Cost Price"
                                                                    />
                                                                    :
                                                                    <div className="text-sm text-gray-500">
                                                                        Rs. {costPrice}
                                                                    </div>
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-md  text-gray-500">

                                                            {
                                                                (this.state.isEdit === true && _id === this.state.id) ?
                                                                    <input
                                                                        type="number"
                                                                        className={`w-full lg:p-4 p-1 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out`}
                                                                        id="sellingPrice"
                                                                        value={this.state.sellingPrice}
                                                                        onChange={e =>
                                                                            this.setState({ sellingPrice: e.target.value })
                                                                        }
                                                                        name="sellingPrice"
                                                                        placeholder="Selling Price"
                                                                    />
                                                                    :
                                                                    <div className="text-sm text-gray-500">
                                                                        Rs. {sellingPrice}
                                                                    </div>
                                                            }
                                                        </td>

                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                                                                                        <tbody className="bg-white divide-y divide-gray-200">
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
                                                                        if (this.state.isEdit === true && _id === this.state.id) {
                                                                            console.log(

                                                                                this.state.quantity,
                                                                                this.state.lowStock,
                                                                                this.state.costPrice,
                                                                                this.state.sellingPrice,
                                                                                this.state.additionalNotes,
                                                                            )
                                                                        }
                                                                        this.setState({ isEdit: !this.state.isEdit })
                                                                        this.setState({ id: _id })
                                                                        this.setState({ name: name })
                                                                        this.setState({ quantity: quantity })
                                                                        this.setState({ costPrice: costPrice })
                                                                        this.setState({ sellingPrice: sellingPrice })
                                                                    }
                                                                }
                                                                className="text-indigo-600 hover:text-indigo-900 rounded-lg border py-3 px-8"
                                                            >
                                                                {
                                                                    (this.state.isEdit === true && _id === this.state.id) ? "Save" : "Edit"
                                                                }
                                                            </button>

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
                </div>
            </div>
        );
    }
}

const mapToState = (state) => {
    return {
        products: state.product.product,
        isLoading: state.product.isLoading,
        isError: state.product.isError,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadData: () => dispatch(ProductActions.readProduct()),
    };
};

export default connect(mapToState, mapDispatchToProps)(ProductComponent);
