import React from "react";
import './styles.css'

const ToggleSwitch = ({ label, checked, onChange, visible }) => {
  return (
    <div className={visible ? "toggle-switch" : "hidden"}>
      <label>{label}</label>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
