//Importing export sync to run commands in the commandline
const {execSync} = require("child_process")

//List the name of the services you want to test
const services = {
  serviceOne:"Actual Service Name",
  serviceTwo:"Another Service Name"
}

//From commandline args, we extract the service name and the environment
const [serviceKey, env = "nonprod"] = process.argv.slice(2)

//In case the user does not pass the service name, we list the service key names for user's reference
if(!serviceKey){
  console.log("Available Services: ")
  Object.keys(services).forEach((key)=> console.log(`  -${key}`))
}

//Find out the project name
const projectName = service[serviceKey];

//If no project name is found, we let the user know that the incorrect service name was entered
if(!projectName){
  console.error(`Unknown Service: ${serviceKey}`);
  process.exit(1)
}


















