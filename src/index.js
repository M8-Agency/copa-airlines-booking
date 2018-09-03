import React, { Component } from "react";
import Validator from "validatorjs";
import PropTypes from "prop-types";
import queryString from "query-string";
import "react-datepicker/dist/react-datepicker.css";
import BookingUI from './BookingUI'
import moment from "moment";

class Booking extends Component {
  constructor(props) {
    super(props);
    
    const today = moment();
    const later = moment().add(5, "days");
    this.tidyDestinations = null;
    this.state = {
      d1: null,
      startDate: today,
      endDate: later,
      cabinClass: "Economy",
      flexibleSearch: true,
      guestTypes0amount: 1,
      guestTypes1amount: 0,
      guestTypes2amount: 0,
      lang: "es",
      locale: "es-es",
      origin: null,
      destination: null,

      inboundOptionDepartureDay: later.format("D"),
      inboundOptionDepartureMonth: later.format("M"),
      inboundOptionDepartureYear: later.format("Y"),

      outboundOptionDepartureDay: today.format("D"),
      outboundOptionDepartureMonth: today.format("M"),
      outboundOptionDepartureYear: today.format("Y"),

      pos: "CMGS",
      tripType: "RT",
      formUrl: "https://bookings.copaair.com/CMGS/AirLowFareSearchExternal.do?",
      error: ""
    };

  }
  componentDidMount() {
    moment.locale(this.state.locale);
  }
  handleOriginChange = (newValue) => {
    this.setState({
      origin: newValue
    });
  }
  handleDestinationChange = (newValue) => {
    this.setState({
      destination: newValue
    });
  }
  handleCabinClassChange = (changeEvent) => {
    this.setState({
      cabinClass: changeEvent.target.value
    });
  }
  handleStartDateChange = (date) => {
    this.setState({
      startDate: date,
      outboundOptionDepartureDay: date.format("D"),
      outboundOptionDepartureMonth: date.format("M"),
      outboundOptionDepartureYear: date.format("Y")
    });
  }
  handleEndDateChange = (date) => {
    this.setState({
      endDate: date,
      inboundOptionDepartureDay: date.format("D"),
      inboundOptionDepartureMonth: date.format("M"),
      inboundOptionDepartureYear: date.format("Y")
    });
  }
  handleAdultGuestChange = (event) =>{
    this.setState({
      guestTypes0amount: event.target.value
    });
  }
  handleChildrenGuestChange = (event) => {
    this.setState({
      guestTypes1amount: event.target.value
    });
  }
  handleInfantGuestChange = (event) => {
    this.setState({
      guestTypes2amount: event.target.value
    });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    //Validar
    const data = {
      cabinClass: this.state.cabinClass,
      flexibleSearch: this.state.flexibleSearch,
      origin: this.state.origin,
      destination: this.state.destination,
      guestTypes0amount: this.state.guestTypes0amount,
      guestTypes1amount: this.state.guestTypes1amount,
      guestTypes2amount: this.state.guestTypes2amount,
      inboundOptionDeparture: [
        this.state.inboundOptionDepartureYear,
        this.state.inboundOptionDepartureMonth,
        this.state.inboundOptionDepartureDay
      ],
      outboundOptionDeparture: [
        this.state.outboundOptionDepartureYear,
        this.state.outboundOptionDepartureMonth,
        this.state.outboundOptionDepartureDay
      ]
    };

    const rules = {
      origin: "required",
      destination: "required",
      guestTypes0amount: "required"
    };

    const attributes = {
      origin: this.props.locale === "es" ? "Desde" : "from",
      destination: this.props.locale === "es" ? "Hacia" : "to",
      guestTypes0amount: this.props.locale === "es" ? "Adultos" : "adults"
    };

    const errors = {
      required:
        this.props.locale === "es"
          ? "El campo de :attribute es requerido"
          : "The :attribute is required"
    };

    const validation = new Validator(data, rules, errors);

    validation.setAttributeNames(attributes);

    validation.fails(
      function() {
        const errors = validation.errors.all();
        const keyName = Object.keys(errors)[0];

        this.setState({
          error: errors[keyName][0]
        });
      }.bind(this)
    );

    validation.passes(
      function() {
        if (data.origin !== data.destination) {
          let extraparams = `d1=PRO_MDCO_US_en_2017`;
          if (window.location.search !== "") {
            const parsed = queryString.parse(window.location.search);
            extraparams = queryString.stringify(parsed);
          }

          // prettier-ignore
          
          (this.props.onSearch) && this.props.onSearch()
          window.open(
            `${this.state.formUrl}cabinClass=${this.state.cabinClass}&flexibleSearch=${this.state.flexibleSearch}&guestTypes[0].amount=${this.state.guestTypes0amount}&guestTypes[0].type=ADT&guestTypes[1].amount=${this.state.guestTypes1amount}&guestTypes[1].type=CNN&guestTypes[2].amount=${this.state.guestTypes2amount}&guestTypes[2].type=INF&inboundOption.departureDay=${this.state.inboundOptionDepartureDay}&inboundOption.departureMonth=${this.state.inboundOptionDepartureMonth}&inboundOption.departureYear=${this.state.inboundOptionDepartureYear}&inboundOption.destinationLocationCode=${this.state.origin}&inboundOption.originLocationCode=${this.state.destination}&lang=${this.props.locale}&outboundOption.departureDay=${this.state.outboundOptionDepartureDay}&outboundOption.departureMonth=${this.state.outboundOptionDepartureMonth}&outboundOption.departureYear=${this.state.outboundOptionDepartureYear}&outboundOption.destinationLocationCode=${this.state.destination}&outboundOption.originLocationCode=${this.state.origin}&pos=CMGS&tripType=RT&${extraparams}`            
          );

        } else {
          this.setState({
            error:
              this.props.locale === "es"
                ? "El origen y el destino deben ser diferentes"
                : "The place of origin and the destination must be different"
          });
        }
      }.bind(this)
    );
  }

  render() {

    this.tidyDestinations = this.props.destinations.filter(d => {
      return d.isCodeShare !== "1";
    }).map(item => {
      return {
        label: `${item.label}`,
        value: item.value
      };
    });
    
    if(document.location.pathname.indexOf('/upload') < 0){
      return (<BookingUI 
        onSubmit={ this.handleSubmit } 
        copy={ this.props.copy }
        {...this.state } 
        
        handleOriginChange = { this.handleOriginChange}
        tidyDestinations = { this.tidyDestinations}
        handleDestinationChange = { this.handleDestinationChange }
        handleStartDateChange = { this.handleStartDateChange }
        handleEndDateChange = { this.handleEndDateChange }
        handleCabinClassChange = { this.handleCabinClassChange }
        handleAdultGuestChange = { this.handleAdultGuestChange }
        handleChildrenGuestChange = { this.handleChildrenGuestChange }
        handleInfantGuestChange = { this.handleInfantGuestChange }
      />);
    }else{
      return <div/>
    }
    

  }
}

const destinations = [
  { label: "Aruba, AW | AUA", value: "AUA" }
  ,{ label: "Asunción, PY | ASU", value: "ASU" }
  ,{ label: "Barranquilla, CO | BAQ", value: "BAQ" }
  ,{ label: "Belice, BZ | BZE", value: "BZE" }
  ,{ label: "Belo Horizonte, BR | BHZ", value: "CNF" }
  ,{ label: "Bogotá, CO | BOG", value: "BOG" }
  ,{ label: "Boston, US | BOS", value: "BOS" }
  ,{ label: "Brasilia, BR | BSB", value: "BSB" }
  ,{ label: "Bucaramanga, CO | BGA", value: "BGA" }
  ,{ label: "Buenos Aires, AR | BUE", value: "EZE" }
  ,{ label: "Cali, CO | CLO", value: "CLO" }
  ,{ label: "Cancún, MX | CUN", value: "CUN" }
  ,{ label: "Caracas, VE | CCS", value: "CCS" }
  ,{ label: "Cartagena, CO | CTG", value: "CTG" }
  ,{ label: "Chicago, US | CHI", value: "ORD" }
  ,{ label: "Chiclayo, PE | CIX", value: "CIX" }
  ,{ label: "Córdoba, AR | COR", value: "COR" }
  ,{ label: "Curazao, AN | CUR", value: "CUR" }
  ,{ label: "David, PA | DAV", value: "DAV" }
  ,{ label: "Fort Lauderdale, US | FLL", value: "FLL" }
  ,{ label: "Georgetown, GY | GEO", value: "GEO" }
  ,{ label: "Guadalajara, MX | GDL", value: "GDL" }
  ,{ label: "Guatemala, GT | GUA", value: "GUA" }
  ,{ label: "Guayaquil, EC | GYE", value: "GYE" }
  ,{ label: "Holguín, CU | HOG", value: "HOG" }
  ,{ label: "Kingston, JM | KIN", value: "KIN" }
  ,{ label: "La Habana, CU | HAV", value: "HAV" }
  ,{ label: "Las Vegas, US | LAS", value: "LAS" }
  ,{ label: "Liberia, CR | LIR", value: "LIR" }
  ,{ label: "Lima, PE | LIM", value: "LIM" }
  ,{ label: "Los Ángeles, US | LAX", value: "LAX" }
  ,{ label: "Managua, NI | MGA", value: "MGA" }
  ,{ label: "Manaus, BR | MAO", value: "MAO" }
  ,{ label: "Maracaibo, VE | MAR", value: "MAR" }
  ,{ label: "Medellín, CO | MDE", value: "MDE" }
  ,{ label: "Mendoza, AR | MDZ", value: "MDZ" }
  ,{ label: "México - Ciudad, MX | MEX", value: "MEX" }
  ,{ label: "Miami, US | MIA", value: "MIA" }
  ,{ label: "Montego Bay, JM | MBJ", value: "MBJ" }
  ,{ label: "Monterrey, MX | MTY", value: "MTY" }
  ,{ label: "Montevideo, UY | MVD", value: "MVD" }
  ,{ label: "Montreal, CA | YUL", value: "YUL" }
  ,{ label: "Nassau, BS | NAS", value: "NAS" }
  ,{ label: "Nueva Orleáns, US | MSY", value: "MSY" }
  ,{ label: "Nueva York, US | NYC", value: "JFK" }
  ,{ label: "Orlando, US | ORL", value: "MCO" }
  ,{ label: "Panamá, PA | PTY", value: "PTY" }
  ,{ label: "Pereira, CO | PEI", value: "PEI" }
  ,{ label: "Porto Alegre, BR | POA", value: "POA" }
  ,{ label: "Puerto España, TT | POS", value: "POS" }
  ,{ label: "Puerto Príncipe, HT | PAP", value: "PAP" }
  ,{ label: "Punta Cana, DO | PUJ", value: "PUJ" }
  ,{ label: "Quito, EC | UIO", value: "UIO" }
  ,{ label: "Recife, BR | REC", value: "REC" }
  ,{ label: "Río de Janeiro, BR | RIO", value: "GIG" }
  ,{ label: "Rosario, AR | ROS", value: "ROS" }
  ,{ label: "San Andrés Isla, CO | ADZ", value: "ADZ" }
  ,{ label: "San Francisco, US | SFO", value: "SFO" }
  ,{ label: "San José, CR | SJO", value: "SJO" }
  ,{ label: "San Juan, PR | SJU", value: "SJU" }
  ,{ label: "San Pedro Sula, HN | SAP", value: "SAP" }
  ,{ label: "San Salvador, SV | SAL", value: "SAL" }
  ,{ label: "Santa Clara, CU | SNU", value: "SNU" }
  ,{ label: "Santa Cruz, BO | SRZ", value: "VVI" }
  ,{ label: "Santiago de Chile, CL | SCL", value: "SCL" }
  ,{ label: "Santiago de los Caballeros, DO | STI", value: "STI" }
  ,{ label: "Santo Domingo, DO | SDQ", value: "SDQ" }
  ,{ label: "Sao Paulo, BR | SAO", value: "GRU" }
  ,{ label: "St Maarten, AN | SXM", value: "SXM" }
  ,{ label: "Tampa, US | TPA", value: "TPA" }
  ,{ label: "Tegucigalpa, HN | TGU", value: "TGU" }
  ,{ label: "Toronto, CA | YTO", value: "YYZ" }
  ,{ label: "Valencia, VE | VLN", value: "VLN" }
  ,{ label: "Washington Dulles, US | WAS", value: "IAD" }
  ,{ label: "Denver, US | DEN", value: "DEN" }
  ,{ label: "Salvador, BR | SSA", value: "SSA" }
  ,{ label: "Fortaleza, BR | FOR", value: "FOR" }
  ,{ label: "Bridgetown, BB | BGI", value: "BGI" }
]

const copy = {
  'buy' : 'Buy your ticket and earn points',
  'from' : 'From',
  'to' : 'To',
  'economy_class' : 'Economy Class',
  'business_class' : 'Business Class',
  'adults' : 'Adults',
  'children' : 'Children',
  'infants' : 'Infants',
  'lbl_submit' : 'SEE FLIGHTS',
}

Booking.propTypes = {
  locale: PropTypes.oneOf(['en','es','pt']),
  copy: PropTypes.object,
  destinations: PropTypes.array,
  onSearch : PropTypes.func
};

Booking.defaultProps = {
  locale: "en",
  copy,
  destinations
};

export default Booking;
