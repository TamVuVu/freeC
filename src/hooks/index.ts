import { useDispatch } from "react-redux";
import { AppDispatch } from "../Store";

type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
