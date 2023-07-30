import { Component, ChangeEvent } from "react";
import LocationDataService from "../services/location.service";
import ILocationData from "../types/location.type";
import NaverMap from "../components/NaverMap";
import ITradeData from '../types/trade.type';
import IRentData from '../types/rent.type';


type Props = {};

type State = {
    locations: ILocationData[],
};

export default class Home extends Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.retrieveLocations = this.retrieveLocations.bind(this);
    this.state = {
        locations: []
    };
  }

  componentDidMount() {
    this.retrieveLocations();
  }
  
  retrieveLocations() {
    LocationDataService.getAll()
      .then((response: any) => {
        this.setState({
            locations: response.data
        });
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  render() {
    const { locations } = this.state;
    return (
        <>
            <NaverMap data={locations}/>
        </>
    );
  }
}
