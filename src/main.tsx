/**
 * Module: main: mount the React application in StrictMode
 * Input: HTML element #root
 * Output: Rendered UserInterface; throws if root is missing
 * Author: Anh Hoang
 * Created: 2026-09-10
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import UserInterface from "./UserInterface";
import "./styles.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing root element");

createRoot(root).render(
  <StrictMode>
    <UserInterface />
  </StrictMode>,
);
