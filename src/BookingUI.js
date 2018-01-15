import Select from "react-select";
import DatePicker from "react-datepicker";
import moment from "moment";

const BookingUI = (props) => (
    <div className="Booking">
        <a id="bookingComponent" name="bookingComponent" />
        <div className="container">
            <div className="row">
                <div className="col-xs-12">
                <span className="Booking__title">{props.copy.buy}</span>
            </div>
        <div className="col-xs-12">
            
            <center>
                {props.error !== "" ? (
                    <p className="error_message_golden">{props.error}</p>
                ) : null}
            </center>
            
        </div>
        <div className="col-xs-12">

        <form onSubmit={ props.onSubmit } noValidate>
            <div className="Booking__80">
                <Select
                    placeholder={props.copy.from}
                    name="desde"
                    options={props.tidyDestinations}
                    className="Booking__desde"
                    simpleValue
                    value={props.origin}
                    onChange={props.handleOriginChange}
                    required={true}
                />

                <Select
                    placeholder={props.copy.to}
                    name="hacia"
                    options={props.tidyDestinations}
                    className="Booking__hacia"
                    simpleValue
                    value={props.destination}
                    onChange={props.handleDestinationChange}
                    required={true}
                />

                <DatePicker
                    selected={props.startDate}
                    selectsStart
                    startDate={props.startDate}
                    endDate={props.endDate}
                    onChange={props.handleStartDateChange}
                    className="Booking__salida"
                    placeholder="Salida"
                    name="salida"
                    locale={props.locale}
                    minDate={moment()}
                    monthsShown={2}
                />
                <DatePicker
                    selected={props.endDate}
                    selectsEnd
                    startDate={props.startDate}
                    endDate={props.endDate}
                    onChange={props.handleEndDateChange}
                    className="Booking__regreso"
                    placeholder="Regreso"
                    name="regreso"
                    locale={props.locale}
                    monthsShown={2}
                />

                <div className="Booking__clases">
                    <label>
                        <input
                            type="radio"
                            name="cabinClass"
                            value="Economy"
                            checked={props.cabinClass === "Economy"}
                            onChange={props.handleCabinClassChange}
                        />{" "}
                        {props.copy.economy_class}
                    </label>
                    <br />
                    <label>
                        <input
                            type="radio"
                            name="cabinClass"
                            value="Business"
                            checked={props.cabinClass === "Business"}
                            onChange={props.handleCabinClassChange}
                        />{" "}
                        {props.copy.business_class}
                    </label>
                </div>

                <div className="Booking__adultos">
                    {props.copy.adults} (12+)
                    <select
                    value={props.guestTypes0amount}
                    onChange={props.handleAdultGuestChange}
                    >
                    <option value="">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    </select>
                </div>

                <div className="Booking__ninos">
                    {props.copy.children} (2-11)
                    <select
                    value={props.guestTypes1amount}
                    onChange={props.handleChildrenGuestChange}
                    >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    </select>
                </div>

                <div className="Booking__infantes">
                    {props.copy.infants} (0-1)
                    <select
                    value={props.guestTypes2amount}
                    onChange={props.handleInfantGuestChange}
                    >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    </select>
                </div>
            </div>
            <div className="Booking__20">
                <input
                    className="Booking__submit"
                    type="submit"
                    value={props.copy.lbl_submit}
                />
            </div>
        </form>
        </div>
    </div>
    </div>
    </div>
)   

export default BookingUI;

