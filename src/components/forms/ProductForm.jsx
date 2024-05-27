import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ProductActions } from "../../redux/actions";
import Loader from "../loader";
import { VendorActions } from "../../redux/actions";
import { store } from "../../redux";
class ProductForm extends Component {
  componentDidMount() {
    this.props.loadData();
  }
  getOption() {
    let selectElement = document.querySelector("#preffered-vendor");
    let output = selectElement.value;
    return output;
  }
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      sellingPrice: "",
      quantity: "",
      lowStock: "",
      costPrice: "",
      preferredVendor: "",
      additionalNotes: "",
      search_vendor: "",
      errors: {
        name: "Enter User Name!",
        sellingPrice: undefined,
        quantity: undefined,
        lowStock: undefined,
        costPrice: undefined,
        preferredVendor: "",
        additionalNotes: "",
      },
    };
  }

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  clearForm = (event) => {
    this.setState({
      name: "",
      sellingPrice: "",
      quantity: "",
      lowStock: "",
      costPrice: "",
      preferredVendor: "",
      additionalNotes: "",
    });
  };

  inputChange = (event) => {
    const { name, value } = event.target;
    console.log(event.target.value, event.target.name);
    this.setState({ [name]: value });
    this.validationErrorMessage(event);
  };

  validationErrorMessage = (event) => {
    const { name, value } = event.target;
    let errors = this.state.errors;
    switch (name) {
      case "name":
        errors.name = value?.length < 1 ? "Enter User Name" : "";
        break;
      case "sellingPrice":
        errors.sellingPrice = value > 1 ? "Enter Greater value than 1" : "";
        break;
      default:
        break;
    }
    this.setState({ errors });
  };

  submitForm = async (event) => {
    event.preventDefault();
    document.getElementById("name")?.focus()
    let data = {};
    data.data = {
      name: this.state.name,
      sellingPrice: this.state.sellingPrice,
      quantity: this.state.quantity,
      costPrice: this.state.costPrice,
      preferredVendor: "Anas",
      additionalNotes: this.state.additionalNotes,
    };
    data.token = this.props.token;
    this.props.addData(data);
    this.clearForm(event);
  };

  getVendorData() {
    let filteredData = [];
    const vendor = this.props.vendor  ? this.props.vendor : [];
    if (this.state.search_vendor?.length > 0) {
      filteredData = [];
      filteredData = vendor?.filter(({ name }) => {
        return name
          .toLowerCase()
          .includes(this.state?.search_vendor?.toLowerCase());
      });
    } else {
      filteredData = [];
      filteredData = vendor;
    }
    return filteredData;
  }

  render() {
    const {
      name,
      sellingPrice,
      quantity,
      costPrice,
      additionalNotes,
    } = this.state;

 
    return (
      <div className=" mt-auto xl:w-10/12 w-full xl:p-10 p-4 bg-gray-50 ml-auto">
        <div className="mt-12">
          <div className="flex flex-row justify-center">
            {/* <div className="w-1/3">
              <div class="flex flex-col mt-3">
                <div className="flex">
                  <div className="">
                    <img
                      src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1130&q=80"
                      alt=""
                      class="rounded w-2/3  object-scale-down"
                    />
                  </div>
                </div>
                <div className="">
                  <div className="py-3">
                    <button
                      className={`w-2/3 border bg-primary hover:bg-indigo-700 transition-all text-white py-2 px-8 text-sm  cursor-pointer  rounded-lg`}
                    >
                      Browse Photos
                    </button>
                  </div>
                </div>
                <div className="">
                  <div className="">
                    <button
                      className={`w-2/3 border bg-error text-white py-2 px-8 text-sm  cursor-pointer  rounded-lg`}
                    >
                      Remove Photo
                    </button>
                   
                  </div>
                </div>
              </div>
            </div> */}
            <div className="w-full xl:w-1/2 xl:px-10">
              <form>
                <div>
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <input
                    value={name}
                    name="name"
                    onChange={(e) => {this.inputChange(e)}}
                    type="text"
                    className={`w-full p-2 text-primary border rounded-md outline-none uppercase text-sm transition duration-150 ease-in-out mb-4`}
                    id="name"
                    autoFocus={true}
                    placeholder=""
                  />
                </div>
                <div>
                  <label htmlFor="qty" className="text-sm font-medium">
                    Quantity in stock
                  </label>
                  <input
                    value={quantity}
                    name="quantity"
                    onChange={(e) => this.inputChange(e)}
                    type="number"
                    min={0}
                    className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4 `}
                    id="qty"
                    placeholder="0"
                  />
                </div>
                {/* <div>
                  <label htmlFor="lqty" className="text-sm font-medium">
                    Low stock warning
                  </label>
                  <input
                    value={lowStock}
                    name="lowStock"
                    onChange={(e) => this.inputChange(e)}
                    type="number"
                    min={0}
                    className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                    id="lqty"
                    placeholder="15"
                  />
                </div> */}
                <div class="flex  flex-col my-3 gap-2 justify-evenly w-full">
                  
                    <label htmlFor="cp" className="text-sm font-medium">
                      Cost Price (1 item)
                    </label>
                    <input
                      value={costPrice}
                      name="costPrice"
                      onChange={(e) => this.inputChange(e)}
                      type="number"
                      min={0}
                      className={`w-full  p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                      id="cp"
                      placeholder="0"
                    />
                
                    <label htmlFor="sp" className="text-sm font-medium">
                      Selling Price (1 item)
                    </label>
                    <input
                      name="sellingPrice"
                      value={sellingPrice}
                      onChange={(e) => this.inputChange(e)}
                      type="number"
                      className={` w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                      id="sp"
                      placeholder="0"
                    />
                
                </div>
                {/* <div className="flex flex-col">
                  <label htmlFor="vendor" className="text-sm font-medium">
                    Preffered vendor
                  </label>
                 {
                    this.getVenderData() !== undefined ? (
                        <select
                        name="vendor"
                        id="preffered-vendor"
                        className="rounded-lg"
                      >
                        {this.getVendorData()?.map(({ name }) => (
                          <option value={name}>{name}</option>
                        ))}
                      </select>
                    ) : (
                        <select
                            name="vendor"
                            id="preffered-vendor"
                            className="rounded-lg"
                        >
                            <option value="vendor">Vendor</option>
                        </select>
                        )
                 }
                </div> */}
                <div>
                  <label htmlFor="vendor" className="text-sm font-medium">
                    Salts
                  </label>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => this.inputChange(e)}
                    type="text"
                    name="additionalNotes"
                    rows="3"
                    className={`w-full p-2 uppercase text-primary form-textarea border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-2`}
                    id="vendor"
                    placeholder="Enter some small description"
                  />
                </div>
                <div class="flex flex-row justify-end mt-3">
                  {/* <div className="py-5">
                    <Link to="/products"  tabIndex="-1" class="w-full">
                      <button
                       
                        onClick={this.clearForm}
                        className={`w-full cursor-pointer py-2 px-12 text-sm text-primary rounded-lg border border-primary focus:outline-none focus:`}
                      >
                        Cancel
                      </button>
                    </Link>
                  </div> */}
                  {this.props.isLoading ? (
                    <div className="py-5">
                      <button
                        className={`w-full border bg-primary hover:bg-indigo-700 transition-all text-white py-2 px-10 text-sm  cursor-pointer  rounded-lg`}
                      >
                        <Loader color="#fff" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-5"  tabIndex="7">
                      <button
                        type="submit"
                        onClick={this.submitForm}
                        className={`w-full border bg-primary hover:bg-indigo-700  transition-all text-white py-2 px-10 text-sm  cursor-pointer  rounded-lg`}
                      >
                        Add Product
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapToState = (state) => {
  return {
    vendor: state.vendor.vendor.vendors,
    isVendorLoading: state.vendor.isLoading,
    token: state.auth.user.token,
    isLoading: state.product.isLoading,
    isError: state.product.isError,
  };
};

const mapDispatchToProps = (dispatch) => {
  const state = store.getState();
  
  return {
    loadData: () => {Object.keys(state?.product.product).length === 0 && dispatch(ProductActions.readProduct())},
    addData: (data) => dispatch(ProductActions.addProduct(data)),
  };
};

export default connect(mapToState, mapDispatchToProps)(ProductForm);
