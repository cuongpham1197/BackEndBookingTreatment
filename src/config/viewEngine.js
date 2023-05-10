import express from "express";

let configViewEngine = (app) => {
    //arrow function
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs"); //dùng view engine tên là ejs
    app.set("views", "./src/views"); //tìm file ejs trong thư mục view
}

module.exports = configViewEngine