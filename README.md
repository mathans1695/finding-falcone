# GeekTrust UI Project:
## Project:
Geektrust front-end development project. You can find the description of the problem by visiting this link -> [GeekTrust](https://www.geektrust.in/coding-problem/frontend/space)

## Project Snapshot:
![Falcone snapshot](https://github.com/mathans1695/finding-falcone/blob/master/src/Images/Falcone_Snapshot.png)

## Project Structure:
![Falcone flowchart](https://github.com/mathans1695/finding-falcone/blob/master/src/Images/App%20Structure.png)

### App Component:
  * Responsible for handling API requests like getting planets and vehicles details, generating unique tokens and final reports
    #### Initial state:
      - vehicles: ''
      - planets: ''
    #### Renders:
      - Falcone component
    #### Methods:
      - *ComponentDidMount* -> Fetch vehicles and planets data from API and set states correspondingly.
        - Set vehicles JSON object received from API GET request to vehicles state
        - Set planets JSON object received from API GET request to planets state
        
      - *getToken*
        - Returns Promise with generated token received from API request. 
        - This method will be called from Falcone Component, when user clicks Find Falcone button in Falcone component and passed as a props to Falcone component.
      
      - *getResults*
        - Returns Promise with results received from API request. 
        - Accepts reqBody as arguments, reqBody JSON object contains planets and vehicles details with above generated token. 
        - This method will be called after token promise resolved in Falcone component and passed as a props to Falcone component.
    #### Final state:
      - vehicles: [object]
      - planets: [object]
      
### Falcone component:
  * Responsible for handling API requests like getting planets and vehicles details, generating unique tokens and final reports
    #### Initial state:
      - *resultJSON: ''* - Will contain the result JSON object
      - *vehicles: []* -> Responsible for tracking vehicles stocks
      - *listOfPlanets:* [] -> Will contain separate planets objects for each destinations. Each planets objects responsible for their corresponding destination
      - *listOfVehicles:* [] -> Will contain separate vehicles objects for each destinations. Each vehicles objects responsible for their destination
      - *planet_names: []* -> Will contain planet names selected by user for generating reqBody obj to be send to getResult method in App component, when user clicks the find falcone button
      - *vehicle_names: []* -> Will contain vehicle names selected by user for generating reqBody obj
      - *time: []* -> Will contain estimate time of travel for each destinations
      - *showMessage: ''* -> Will contain message that needs to be shown to user, when user resets the game or when user select a rocket that is not in stock
    #### Renders:
      - Navbar component
      - MissionPlan component or Result component
      - Footer component
    #### Methods:
      - *ComponentDidMount* -> Generate listOfPlanets, listOfVehicles and vehicles object and set it to its corresponding state
      
      - *handleClick*
        - This method will be called, when user clicks the Find Falcone button.
        - Generate reqBody using planet_names and vehicle_names state, and token generated using getToken method in App component.
        - Sets resultJSON state with the help of result method
      
      - *updateListOfPlanets(id, removePlanet, planetDistance)*
        - This method will be called, when user selects a planet in any one of the destinations
        - This method will be passed as a prop to MissionPlan component, which in-turn passes the method to ChoosePlanet component
        - Will remove selected planets from other destinations. This will be done with the help of listOfPlanets state. Each destinations has their own planets object, one will not get affected by other. Will remove selected planet in other destinations.
        - Will also update planet_names state
        - Responsible for Rendering AssignRocket component in that selected destination with the help of updateListOfVehicle method
        
      - *updateListOfVehicles(id, planetDistance)*
        - This method will be called along with updateListOfPlanets method from ChoosePlanet component
        - Will render AssignRocket component by setting isRenderd property to true in listOfVehicles state for that selected destination
        - Analyse the probability of each rocket in that destination
        
      - *updateVehicle(id, rocket, speed, planetDistance)*
        - This method will be called, when user selects a rocket in any one of the destinations
        - This method will be passed as a prop to MissionPlan component, which in-turn passes the method to AssignRocket component
        - Will update the vehicles stocks in each destination with the help of listOfVehicles state and it will do so with the help of following conditions:
           - If AssignRocket component is not rendered means, update the stock in that destination (listOfVehicles state will be updated)
           - If AssignRocket component rendered, but user has not selected any rockets in that destination means, update the stock in that particular destination (listOfVehicles state will be updated)
           - If AssignRocket component rendered and user has already selected a rocket means, the stocks will not get updated in that destination (listOfVehicles state will not get affected here, but in order to track the stock, app will update vehicles state in this condition and also in all the above mentioned conditions)
       - Will update the vehicle_names state
       
     - *reset(e)*
       - Reset the states to its initial state
       - When reset button clicked on home page, will reset the state to its initial state
       - When reset button clicked on result page, will reset the state to its initial state and redirect the user to home page
       - Will update the showMessage state, to indicate the user that reset operation was successful
           
    #### Final state:
      - resultJSON: [object]
      - vehicles: [object]
      - listOfVehicles: [object, object, object, object]
      - planet_names: [string, string, string, string]
      - vehicle_names: [string, string, string, string]
      - time: [Number, Number, Number, Number]
      - showMessage: [String]
