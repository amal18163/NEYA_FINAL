/*
FILENAME: load.js
AUTHOR: Amal Tidjani
DATE: July 2016
*/

/*Load header HTML and use run_header to load JS animations*/
$("#header_here").load("index.html header");

/*Load header HTML and use run_header to load JS animations*/
$("#footer_here").load("index.html footer", animateLinks);

$("#mainten_here").load("news.html #mainten_content");
