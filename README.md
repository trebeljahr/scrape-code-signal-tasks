# Scrape ![CodeSignal](../main/code-signal-logo.svg) Tasks 

This is a script I built with puppeteer and nodejs, that can scrape the task solutions as well as the task descriptions from the Website CodeSignal and exports them to .md and the respective language files, so that you can add the work you did on CodeSignal to your github repo easily. 

To use this run `npm install`. 

Then recreate the `.env.example` as a `.env` and replace the placeholders with your own CodeSignal credentials. 

Finally run `npm start` and wait until it is done.

Example Run should look something like this: 

![Example Run Screenshot](../main/example-output.png)

When everything is done the script should have populated the `out` folder with your solved tasks descriptions and solutions files. 
Now you can just grab and copy them into your github repo and you have all your solved CodeSignal tasks in your own repo. 

If the script breaks somewhere along the way (sometimes it does due to connection issues), simply restarting and running it again, is often enough to make it work. If it keeps breaking, feel free to create a gist and I'll try to fix it. Or even better feel free to create a pull request that fixes it yourself. 




