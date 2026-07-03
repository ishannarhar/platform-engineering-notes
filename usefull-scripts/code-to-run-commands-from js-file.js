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
//inform the user which service is being run
console.log(`Running $${projectName} in $${env} environment`)

try{
  console.log("Clearing previous results")
  execSync("npm run clear", {stdio:"inherit", shell:"powershell"})

  console.log("Copying history...")
  execSync("npm run history", {stdio:"inherit", shell:"powershell"})

  //Wrapping the test execution code in its own try catch
  let testsFailed = false;

  try{
    console.log(`Running tests for ${projectName}...`)
    let cmd
    if(serviceKey != "all"){
      cmd = `npx playwright test --project="${projectName}"`
    }else{
      cmd = `npx playwright test`
    }
    //execute the created command i.e. cmd
    execSync(cmd,{
      stdio:"inherit",
      env: {...process.env, TEST_ENV:env},
      shell:"powershell"
    })
  } catch(err){
    console.warn("Some tests failed, but continuing to generate report")
    testsFailed = true
  }

  console.log("Generating Report...")
  execSync("npm run report", {stdio:"inherit", shell:"powershell"})

  if(testsFailed){
    console.log("Test execution completed with failures")
    process.exit(1)
  }else{
    console.log("All tests passed")
  }
}catch(error){
  console.error(error)
  process.exit(1)
}



















