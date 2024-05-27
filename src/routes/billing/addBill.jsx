import React from "react";
import "../../index.css";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar/sidebar";
import { TrashIcon } from "../../icons/index";
import { ProductActions, BillActions } from "../../redux/actions";
import { store } from "../../redux";
import { connect } from "react-redux";
import Loader from "../../components/loader";
import Select from "react-select"

// Filtered Data has all the products

function getCurrentDate(separator = "-") {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${date}${separator}${month < 10 ? `0${month}` : `${month}`
        }${separator}${year}`;
}

class AddBill extends React.Component {
    componentDidMount() {
        this.props.loadData();
    }
    //to get data of the medicine dropdown
    getOption() {
        let output = this.state.search_product;
        console.log(this.state.search_product)
        return output;
    }
    constructor(props) {
        super(props);

        // Setting up state
        this.state = {
            userInput: "",
            discount: "",
            filterProduct: "",
            focusedIndex: -1,
            incomingAmout: "",
            remainingAmount: 0,
            name: "",
            billdesc: "",
            date: getCurrentDate(),
            total: 0,
            productName: "",
            productQty: "",
            productPrice: "",
            productID: 0,
            maxLimit: 10,
            productList: [],
            search_product: "",
        };
    }
    addItem() {



        // check if option is selected
        if (this.getOption() === "") {
            return;
        }
        else {



            let nameoftile =
                this.getMedicineData()[this.searchMedicineData(this.getOption())].name;
            let priceoftile =
                this.getMedicineData()[this.searchMedicineData(this.getOption())]
                    .sellingPrice * this.state.productQty;
            let quantity = this.getMedicineData()[this.searchMedicineData(this.getOption())].quantity;
            let pictureoftile =
                this.getMedicineData()[this.searchMedicineData(this.getOption())].picture;
            let unitPrice = this.getMedicineData()[this.searchMedicineData(this.getOption())].sellingPrice;

            const userInput = {
                id: this.state.productID,
                productName: nameoftile,
                productQty: this.state.productQty,
                productPrice: priceoftile,
                picture: pictureoftile,
                unitPrice: unitPrice
            };

            // Update productList
            const productList = [...this.state.productList];
            if ((quantity - this.state.productQty < 0 ) || this.state.productQty === 0) {
                return
            }
            else {

                productList.push(userInput);
                // reset state
                this.setState({
                    productList,
                    userInput: "",
                    productName: "",
                    productQty: "",
                    productPrice: "",
                    productID: this.state.productID + 1,
                    total: this.state.total + priceoftile,
                });
            }
        }

    }
    // Function to delete item from productList use id to delete
    deleteItem(key) {
        const productList = [...this.state.productList];
        const deletetile = productList.filter((item) => item.id === key);
        let priceoftile = deletetile[0].productPrice;

        // Filter values and leave value which we need to delete
        const updateproductList = productList.filter((item) => item.id !== key);

        // Update productList in state
        this.setState({
            productList: updateproductList,
            total: this.state.total - priceoftile,
            search_product: ""
        });
    }

    inputChange = (event) => {
        const { name, value } = event.target;
        console.log(value, name);
        this.setState({ [name]: value });
        let maxLimit =
            this.getMedicineData()[this.searchMedicineData(this.getOption())]?.quantity;
        this.setState({
            maxLimit: maxLimit,
        });
    };

    clearForm = (event) => {
        this.setState({
            userInput: "",
            name: "",
            billdesc: "",
            date: getCurrentDate(),
            total: 0,
            discount: "",
            remainingAmount: 0,
            incomingAmout:"",
            focusedIndex: -1,
            productName: "",
            productQty: "",
            productPrice: "",
            productID: "",
            productList: [],
            search_product: "",
        });
    };

    submitForm = async (event) => {
        event.preventDefault();
    
        let data = {};

        let someList = [];
        for (let i = 0; i < this.state.productList.length; i++) {
            someList[i] = {
                productId: this.getMedicineData()[this.searchMedicineData(this.state.productList[i].productName)]._id,
                productName: this.state.productList[i].productName,
                quantity: this.state.productList[i].productQty,
                price: this.state.productList[i].productPrice,
            };
        }

        data.data = {
            phoneNumber: this.state.name,
            products: someList,
            date: new Date(this.state.date),
            total: this.state.total - (this.state.total * this.state.discount) / 100,
            discount: this.state.discount || 0
        };
        data.token = this.props.token;
        if (this.state.productList.length > 0) {

            await this.props.sendData(data);

            this.clearForm(event);
        }
    };

    getMedicineData() {
        let filteredData = [];
        const products = Object.keys(this.props.products).length > 0 ? this.props.products : [];
        filteredData = products;


        return filteredData;
    }
    getAllMedicineData() {
        let filteredData = [];
        console.log(this.props)
        const products = this.props.products ? this.props.products : [];
        filteredData = [];
        filteredData = products;
        return filteredData;
    }

    searchMedicineData(search) {
        let fullMedicineData = this.getMedicineData();
        return fullMedicineData.findIndex(checkName);
        function checkName(name) {
            return name.name === search;
        }
    }
    searchAllMedicineData(search = "") {
        let fullMedicineData = this.getAllMedicineData()
            ? this.getAllMedicineData()
            : [];
        return fullMedicineData.findIndex(checkName);
        function checkName(name) {
            return name.name === search;
        }
    }

    onKeyDown = (event) => {
        const { keyCode } = event;
        const { filterProduct } = this.state;

        switch (keyCode) {
            case 40: // DOWN arrow key
                event.preventDefault();
                this.focusNextItem();
                break;
            case 38: // UP arrow key
                event.preventDefault();
                this.focusPreviousItem();
                break;
            case 13: // ENTER key
                event.preventDefault();
                this.selectItem();
                document.getElementById("quantity")?.focus()
                break;
            default:
                if (filterProduct.length === 0) return;
        }
    };

    focusNextItem = () => {
        const { focusedIndex } = this.state;
        const items = this.getFilteredItems();

        let newIndex = focusedIndex + 1;
        if (newIndex >= items.length) newIndex = 0;

        this.setState({ focusedIndex: newIndex });
    };

    focusPreviousItem = () => {
        const { focusedIndex } = this.state;
        const items = this.getFilteredItems();

        let newIndex = focusedIndex - 1;
        if (newIndex < 0) newIndex = items.length - 1;

        this.setState({ focusedIndex: newIndex });
    };

    selectItem = () => {
        const { focusedIndex } = this.state;
        const items = this.getFilteredItems();

        if (focusedIndex >= 0 && focusedIndex < items.length) {
            const selectedItem = items[focusedIndex];
            this.setState({ search_product: selectedItem.name, filterProduct: "" });
        }
    };

    getFilteredItems = () => {
        const { filterProduct } = this.state;
        return this.getMedicineData().filter(({ name, additionalNotes }) =>
            name.toLowerCase().includes(filterProduct.toLowerCase()) ||
            additionalNotes.toLowerCase().includes(filterProduct.toLowerCase())
        );
    };


    render() {
        // this.getOption();
        console.log(this.state.maxLimit);
        // let limit =
        //   this.getAllMedicineData()[
        //     this.searchAllMedicineData(this.getOption() ? this.getOption() : "")
        //   ].quantity;
        // console.log(limit);
        // this.setState({
        //   maxLimit: limit,
        // });

        return (
            <div>
                <Header />
                {/* sidebar */}
                <div className="h-9/10 ">
                    <Sidebar place="4" />
                    {/* main content container */}
                    <div className=" mt-auto xl:w-10/12 pb-20 xl:bp-0 w-full lg:px-20 p-4 ml-auto bg-gray-50">
                        <div className="container bg-white border rounded-lg border-subtle mt-12 xl:p-10 p-2 ">
                            {/* total amount date showcase */}
                            <div className="flex flex-col gap-5 mb-4">
                                <div className="flex flex-col gap-5  lg:flex-row lg:justify-center">
                                    <div className="flex flex-col gap-5 lg:flex-row  justify-between  w-full">
                                        <div className="w-full  lg:w-1/5 flex flex-col">
                                            <div>
                                                <h1 className="text-xl font-medium antialiased mb-1 text-left">
                                                    Total amount
                                                </h1>
                                            </div>
                                            <div>
                                                <h1 className="text-2xl text-primary font-bold antialiased mb-1 text-left">
                                                    Rs. {this.state.total.toFixed(2)}
                                                </h1>
                                            </div>
                                        </div>

                                        <div className="w-full  flex-1 flex flex-col lg:items-center">
                                            <div>
                                                <h1 className="text-xl font-medium antialiased mb-1 text-left">
                                                    After Disc %
                                                </h1>
                                            </div>
                                            <div>
                                                <h1 className="text-2xl text-primary font-bold antialiased mb-1 text-left">
                                                    Rs. {
                                                        (this.state.total - (this.state.total * this.state.discount) / 100).toFixed(2)
                                                    }
                                                </h1>
                                            </div>
                                        </div>

                                        <div className="w-full  flex-1 flex flex-col lg:items-center">
                                            <div>
                                                <h1 className="text-xl font-medium antialiased mb-1 text-left">
                                                    Return amount
                                                </h1>
                                            </div>
                                            <div>
                                                <h1 className="text-2xl text-primary font-bold antialiased mb-1 text-left">
                                                    Rs. {this.state.remainingAmount.toFixed(2)}
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:w-1/2">
                                        <div className="lg:w-1/2 flex flex-col ml-auto">
                                            <div>
                                                <h1 className="text-xl font-medium antialiased mb-1 text-left">
                                                    Date
                                                </h1>
                                            </div>
                                            <div>
                                                <h1 className="text-2xl text-primary font-bold  antialiased mb-3 text-left">
                                                    {getCurrentDate()}
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full  flex-1 flex flex-col">
                                    <div>
                                        <label htmlFor="discount" className="text-sm">
                                            Discount %
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            className={`w-full p-2 text-primary border rounded-md font-bold outline-none text-sm transition duration-150 ease-in-out mb-3`}
                                            id="discount"
                                            name="discount"
                                            value={this.state.discount}
                                            onChange={(e) => this.setState(
                                                { discount: e.target.value }
                                            )}
                                            placeholder="Enter discount"
                                        />
                                    </div>
                                </div>
                                <div className="w-full  flex-1 flex flex-col">
                                    <div>
                                        <label htmlFor="amount" className="text-sm">
                                            Amount
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            className={`w-full p-2 text-primary border rounded-md font-bold outline-none text-sm transition duration-150 ease-in-out mb-3`}
                                            id="amount"
                                            name="amount"
                                            value={this.state.incomingAmout}
                                            onChange={(e) => this.setState(
                                                { incomingAmout: e.target.value }
                                            )}
                                            onKeyDown={(e) => {
                                                if (e.keyCode === 13) {
                                                    this.setState({
                                                        remainingAmount: this.state.incomingAmout - (this.state.total - (this.state.total * this.state.discount) / 100)

                                                    })
                                                }
                                            }}
                                            placeholder="Enter amount"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* name*/}
                            {/* <div className="mt-4">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    autofocus
                                    className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                                    id="name"
                                    name="name"
                                    value={this.state.name}
                                    onChange={(e) => this.inputChange(e)}
                                    placeholder="Jhon Doe"
                                    required
                                />
                            </div> */}
                            {/* description */}
                            {/* <div>
                                <label htmlFor="description" className="text-sm font-medium">
                                    Description
                                </label>
                                <textarea
                                    type="text"
                                    rows="2"
                                    className={`w-full p-2 text-primary form-textarea border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                                    id="description"
                                    name="billdesc"
                                    value={this.state.billdesc}
                                    onChange={(e) => this.inputChange(e)}
                                    placeholder="small description about the bill (if any)"
                                />
                            </div> */}
                            <div className="flex flex-col-reverse w-full gap-5  justify-between">
                                <h1 className="lg:text-3xl text-xl font-medium mt-4 text-primary">
                                    Products
                                </h1>
                                {/* <div className=" py-2 flex flex-col gap-5 lg:gap-0 w-full lg:flex-row h-full 2xl:justify-end  items-start">
                                    <div className="w-full  flex flex-col ">
                                        <label htmlFor="product-dropdown" className="text-sm">
                                            Medicine Name
                                        </label>
                                       
                                        <div className="w-full relative gap-1">
                                            <input
                                                type="search"
                                                className={`w-full p-2 border rounded-md outline-none text-sm`}
                                                id="qty"
                                                value={this.state.search_product}
                                                onChange={(e) => {
                                                    if (e)
                                                        this.setState({  search_product:e.target.value,filterProduct:e.target.value });
                                                }}
                                                autoComplete="off"
                                                required
                                            />
                                           
                                            {this.state.filterProduct.length > 0 && (
                                                <div className="absolute w-full  bg-white border rounded-lg border-gray-200 shadow-lg max-h-96 overflow-y-auto">
                                                    <ul>
                                                        {this.getMedicineData()
                                                            .filter(({ name, additionalNotes }) =>
                                                                name.toLowerCase().includes(this.state.filterProduct.toLowerCase()) ||
                                                                additionalNotes.toLowerCase().includes(this.state.filterProduct.toLowerCase())
                                                            )
                                                            .map((item) => (
                                                                <li
                                                                    key={item._id}
                                                                    onClick={() => {
                                                                        this.setState({ search_product: item.name, filterProduct:"" });
                                                                    }}
                                                                    className="hover:bg-gray-200 p-2 cursor-pointer flex items-center justify-between"
                                                                >
                                                                    <span>{item.name}</span>
                                                                    <span>Rs. {item.sellingPrice}</span>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                    <div className="w-full lg:w-72 flex flex-col lg:px-2">
                                        <label htmlFor="qty" className="text-sm">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            className={`w-full p-2 border rounded-md outline-none text-sm`}
                                            id="qty"
                                            name="productQty"
                                            value={this.state.productQty}
                                            onChange={(e) => this.inputChange(e)}
                                            placeholder="10"
                                            required
                                        />

                                        <div className="text-error h-8 text-xs py-1 font-medium">
                                            {this.state.productQty > this.state.maxLimit && (
                                                " not enough stock  ")}
                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => this.addItem()}
                                        className={`max-width-min lgself-center mb-2 h-fit bg-primary hover:bg-indigo-700 transition-all text-white py-2.5 px-6 text-sm  cursor-pointer  rounded-lg`}
                                    >
                                        Add Product
                                    </button>

                                </div> */}
                                <div className="py-2 flex flex-col gap-5 lg:gap-0 w-full lg:flex-row h-full 2xl:justify-end items-start">
                                    <div className="w-full flex flex-col">
                                        <label htmlFor="product-dropdown" className="text-sm">
                                            Medicine Name
                                        </label>

                                        <div className="w-full relative gap-1">
                                            <input
                                                type="search"
                                                className="w-full p-2 border rounded-md outline-none text-sm"
                                                value={this.state.search_product}
                                                id="search_medicine"
                                                onChange={(e) => {
                                                    this.setState({ search_product: e.target.value, filterProduct: e.target.value });
                                                }}
                                                autoFocus={true}
                                                onKeyDown={this.onKeyDown}
                                                autoComplete="off"
                                                required
                                            />

                                            {this.state.filterProduct.length > 0 && (
                                                <div className="absolute w-full bg-white border rounded-lg border-gray-200 shadow-lg max-h-96 overflow-y-auto">
                                                    <ul>
                                                        {this.getFilteredItems().map((item, index) => (
                                                            <li
                                                                key={item._id}
                                                                onClick={() => {
                                                                    this.setState({ search_product: item.name, filterProduct: "" });
                                                                }}
                                                                className={`p-2 cursor-pointer flex items-center justify-between ${index === this.state.focusedIndex ? "bg-gray-200" : ""}`}
                                                            >
                                                                <span className="uppercase">{item.name}</span>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="w-24">Items {item.quantity}</span>
                                                                    <span className="w-20">Rs. {item.sellingPrice.toFixed(2)}</span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-72 flex flex-col lg:px-2">
                                        <label htmlFor="qty" className="text-sm">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full p-2 border rounded-md outline-none text-sm"
                                            name="productQty"
                                            id="quantity"
                                            value={this.state.productQty}
                                            onChange={(e) => this.inputChange(e)}
                                            placeholder="10"
                                            onKeyDown={
                                                (e) => {
                                                    if (e.key === 'Enter') {
                                                        this.addItem()
                                                        document.getElementById("search_medicine")?.focus();
                                                        this.setState(
                                                            {
                                                                search_product:"",
                                                                productQty:""
                                                            }
                                                        );
                                                    }
                                                }
                                            }
                                            required
                                        />
                                       
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            this.addItem()
                                            document.getElementById("search_medicine")?.focus();
                                            this.setState(
                                                {
                                                    search_product:""
                                                }
                                            );
                                        }}
                                        className="max-width-min lgself-center mb-2 h-fit bg-primary hover:bg-indigo-700 transition-all text-white py-2.5 px-6 text-sm cursor-pointer rounded-lg"
                                    >
                                        Add Product
                                    </button>
                                </div>
                            </div>

                            {/* add multiple products */}
                            <div className="my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                        <ul>

                                            <li

                                                className="flex flex-row justify-between items-center my-2"
                                            >
                                                <div className="flex items-center justify-start w-48">
                                                    <div className="flex-shrink-0 h-12 w-12">
                                                        <img
                                                            className="h-12 w-12 rounded-lg"
                                                            src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1130&q=80"
                                                            alt="medicine pic"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col text-bold text-lg capitalize ml-2">
                                                        Medicine Name
                                                    </div>
                                                </div>
                                                <div className="flex w-20">Quantity</div>
                                                <div className="flex w-20">Unit Price</div>
                                                <h1 className="w-20 text-2xl text-black font-medium antialiased whitespace-nowrap  text-left">
                                                    Price
                                                </h1>
                                                <button
                                                    type="button"
                                                    className="bg-red-100 p-2 w-10 invisible h-10 rounded-lg"
                                                >
                                                    <TrashIcon stroke="red"></TrashIcon>
                                                </button>

                                            </li>

                                            {this.state.productList.map((item) => {
                                                return (
                                                    <li
                                                        key={item.id}
                                                        className="flex flex-row justify-between items-center my-2"
                                                    >
                                                        <div className="flex items-center justify-start w-48">
                                                            <div className="flex-shrink-0 h-12 w-12">
                                                                <img
                                                                    className="h-12 w-12 rounded-lg"
                                                                    src={
                                                                        item.picture
                                                                            ? item.picture
                                                                            : "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1130&q=80"
                                                                    }
                                                                    alt="medicine pic"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col text-bold text-lg whitespace-nowrap uppercase ml-2">
                                                                {item.productName}
                                                            </div>
                                                        </div>
                                                        <div className="flex w-20">{item.productQty}</div>
                                                        <div className="flex w-20">{item.unitPrice.toFixed(2)}</div>

                                                        <h1 className="w-20 text-2xl text-black font-medium antialiased whitespace-nowrap  text-left">
                                                            Rs. {item.productPrice}
                                                        </h1>
                                                        <button
                                                            type="button"
                                                            onClick={() => this.deleteItem(item.id)}
                                                            className="bg-red-100 p-2 rounded-lg"
                                                        >
                                                            <TrashIcon stroke="red"></TrashIcon>
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/* <BillProduct items={this.state.productList} deleteFunc={() => this.deleteItem(item.id)} /> */}
                            {/* <Link to="/products" class="w-full"> */}
                            {/* get amount from user */}
                            {!this.props.isLoading ? (
                                <button
                                    type="submit"
                                    onClick={this.submitForm}
                                    className={`w-full border bg-primary hover:bg-indigo-700 transition-all text-white py-2 px-10 text-sm  cursor-pointer  rounded-lg`}
                                >
                                    Create Bill
                                </button>
                            ) : (
                                <button
                                    className={`w-full flex disable cursor-pointer justify-center items-center bg-primary py-2 px-4 rounded border focus:outline-none`}
                                >
                                    <div className="justify-self-center">
                                        <Loader color="#ffffff" />
                                    </div>
                                </button>
                            )}
                            {/* </Link> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {

    return {
        products: state.product.product,
        isLoading: state.product.isLoading,
        isError: state.product.isError,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadData: () => dispatch(ProductActions.readProduct()),
        sendData: (data) => dispatch(BillActions.addBill(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddBill);
