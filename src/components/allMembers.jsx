import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Search from "./memberSearch";
export default function AllMembers(){
    return(
        <div className="">
            <Search />
        </div>
    )
}