console.log("Hello world");

import "react";
import "react-dom";


import component from "./component";

import { bake } from "./shake";

bake();

import "purecss";
import "./main.css";

document.body.appendChild(component());
