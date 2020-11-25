# Scrape CodeSignal Tasks

This is a script I built with puppeteer and nodejs, that can scrape the task solutions as well as the task descriptions from the Website CodeSignal and exports them to .md and the respective language files, so that you can add the work you did on CodeSignal to your github repo easily. 

To use this run `npm install`. 
Then recreate the .env.example as a .env and replace the placeholders with your own CodeSignal credentials. 
Finally run `npm start` and wait. 

Sometimes the script needs a few tries because of puppeteer/CodeSignal interaction weirdness. 

When everything is done the script should have populated the results folder with your solved tasks descriptions and solutions files. 


