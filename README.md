# GeekTrust UI Project - [Github Repo link](https://github.com/mathans1695/finding-falcone)
## To get the code working, follow the following steps:
   Note: This section is only for geektrust submission, if you're not from geektrust, kindly ignore this section.
   1. Install node.js
   2. Unzip the rar file
   3. Open Command prompt
   3. Navigate to the unzipped folder
   4. Run npm install
   5. Run npm start to launch the app
   6. For tests, Run npm test
   
## Project:
Geektrust front-end development project. You can find the description of the problem by visiting this link -> [GeekTrust](https://www.geektrust.in/coding-problem/frontend/space)

## Project Snapshot:
![Falcone snapshot](https://github.com/mathans1695/finding-falcone/blob/master/src/Images/Falcone_Snapshot.png)

## Project Structure:
![Falcone flowchart](https://github.com/mathans1695/finding-falcone/blob/master/src/Images/App%20Structure.png)

### App Component:
  * Responsible for handling API requests like getting planets and vehicles details, generating unique tokens and final report
    #### Initial state:
      - *vehicles: ''*
      - *planets: ''*
      - *resultJSON: [Object]*
    #### Renders:
      - Falcone component
    #### Methods:
      - *useEffect* -> Fetch vehicles and planets data from API and set states accordingly.
        - Set vehicles JSON object received from API GET request to vehicles state.
        - Set planets JSON object received from API GET request to planets state.
        
      - *handleResult*
         - Get result and set resultJSON state with result method
        
      - *resetResultJSON*
         - reset the resultJSON state
    #### Final state:
      - vehicles: [object]
      - planets: [object]
      - resultJSON: [object]
      
### Falcone component:
  * Responsible for managing the selectedVehicles, selectedPlanets, time and message.
    #### Initial state:
      - *selectedPlanets: []* -> Will contain planet names selected by user for generating reqBody object to be send to getResult method in App component, when user clicks the find falcone button.
      - *selectedVehicles: []* -> Will contain vehicle names selected by user for generating reqBody object.
      - *time: []* -> Will contain estimate time of travel for each destination.
      - *message: ''* -> Will contain message that needs to be shown to user, when user resets the game or when user select a rocket that is not in stock.
    #### Props - From App component:
      - *planets: [object]*
      - *vehicles: [object]*
      - *handleResult: function handleResult()*
    #### Renders:
      - Navbar component
      - MissionPlan component or Result component
      - Footer component
    #### Methods:
      - *useEffect* -> reset message to initial state after two seconds
      
      - *handleClick*
        - Invokes handleResult passed as props with selectedPlanets and selectedVehicles state
        
      - *updateSelectedPlanets*
         - Updates the selectedPlanets state with selected planets in each destinations
         
      - *updateSelectedVehicles*
         - Updates the selectedVehicles state with selected vehicles in each destinations
         
      - *updateTime*
         - Updates the selectedTime state with estimated time in each destinations
       
      - *reset(e)*
         - Reset the every states in the application to its initial state
          - When reset button clicked on home page, will reset the state to its initial state
          - When reset button clicked on result page, will reset the state to its initial state and redirect the user to home page
          - Also updates the message state, to indicate the user that reset operation was successful
           
    #### Final state:
      - *selectedPlanets: [string, string, string, string]*
      - *selectedVehicles: [string, string, string, string]*
      - *time: [Number, Number, Number, Number]*
      - *message: [String]*
      
### Mission Component:
  * Acts as an intermediary between Falcone and ChoosePlanet, Falcone and AssignRocket component.
    #### Initial state:
      - *vehicles: []* -> Responsible for tracking vehicles stocks.
      - *listOfPlanets:* [] -> Will contain separate planets object for each destination. Each planets object is responsible for their corresponding destination.
      - *listOfVehicles:* [] -> Will contain separate vehicles object for each destination. Each vehicles objects is responsible for their destination.
    #### Props - From Falcone component:
      - *planets: [object]*
      - *vehicles: [object]*
      - *updateSelectedPlanets: function updateSelectedPlanets()*
      - *updateSelectedVehicles: function updateSelectedVehicles()*
      - *updateTime: function updateTime()*
      - *updateMessage: function updateMessage()*
      - *time: [Number, Number, Number, Number]*
      - missionPlanRef
    #### Renders:
      - ChoosePlanet component
      - AssignRocket component
    #### Methods:
      - *updateListOfPlanets(id, removePlanet, planetDistance)*
        - This method will be called, when user selects a planet in any one of the destinations.
        - This method will be called from ChoosePlanet component
        - Will remove selected planets from other destinations. This will be done with the help of listOfPlanets state. Each destinations has their own planets object, one will not be get affected by other.
        - Will also update selectedPlanets state.
        - Responsible for Rendering AssignRocket component in the selected destination with the help of updateListOfVehicle method.
        
      - *updateListOfVehicles(id, planetDistance)*
        - This method will be called along with updateListOfPlanets method from ChoosePlanet component.
        - Will render AssignRocket component by setting isRenderd property to true in listOfVehicles state for the selected destination.
        - Analyse the probability of each rocket in the selected destination.
        - This method also updates the global state.
        
      - *handleRocketChange(id, rocket, speed, planetDistance)*
        - This method will be called, when user selects a rocket in any one of the destinations.
        - This method will be passed as a prop to AssignRocket component.
        - Will update the vehicles stocks in each destination with the help of listOfVehicles state and it will do so with the help of following conditions:
           - If user has not selected any rockets in that destination means, update the stock in that particular destination (listOfVehicles state will be updated).
           - If AssignRocket component rendered and user has already selected a rocket means, the stocks will not get updated in that destination (listOfVehicles state will not get affected here, but in order to track the stock, app will update vehicles state in this condition and also in all the above mentioned conditions).
        - Will update the selectedVehicles state.
        - This method also updates the global state

### ChoosePlanet Component:
  * Render select element using planets props received from MissionPlan component.
    #### Props - From MissionPlan component:
      - *planets: [object]*
      - *updateListOfPlanets: function updateListOfPlanets()*
      - *updateListOfVehicles: function updateListOfVehicles()*
    #### Renders:
      - Select Element
    #### Methods:
      - *handleChange(e)*
        - Will call updateListOfPlanets and updateListOfVehicles method in Falcone component, when user selects or change a planet
        
### AssignRocket Component:
  * Render input element using vehicles props received from MissionPlan component.
    **Note:** input element will be checked based on showAlways property of vehicles object received from MissionPlan component, not on the basis of user selection.
    
### Navbar Component:
  * Renders title, reset button and GeekTrust link
  
### Footer Component:
  * Renders GeekTrust Link
  
### Result Component:
  * Display the report to King Shan
    #### Props - From Falcone component:
      - *resultJSON: [object]*
      - *time: [Number, Number, Number, Number]*
      - *reset: function reset()*
    
    #### Renders:
    Success or Failure message
    
### Testing:
   #### App and Falcone component:
      - Tested with the help react testing library
   #### Other components:
      - Tested with the help of Jest and Enzyme
  
  
## Conclusion
  I learned a lot from doing this project. Before this project, I don't know about testing and its importance. But now I know, little bit about testing. 
  
  
  
  **Learn by doing simple things**
