# GeekTrust UI Project:
## Project:
Geektrust front-end development project. You can find the description of the problem by visiting this link -> [GeekTrust](https://www.geektrust.in/coding-problem/frontend/space)

## Project Snapshot:
![Falcone snapshot](https://github.com/mathans1695/finding-falcone/blob/master/src/Images/Falcone_Snapshot.png)

## Project Structure:
![Falcone flowchart](https://github.com/mathans1695/finding-falcone/blob/master/src/Images/App%20Structure.png)

### <App />
  * Responsible for handling API requests like getting planets and vehicles details, generating unique tokens and final reports
    #### Initial state:
      - vehicles: ''
      - planets: ''
    #### Renders:
      - Falcone component
    #### Methods:
      - ComponentDidMount -> Fetch vehicles and planets data from API and set states correspondingly. Returns undefined.
        - Set vehicles JSON object received from API GET request to vehicles state
        - Set planets JSON object received from API GET request to planets state
        
      - getToken -> Returns Promise with generated token received from API request. This method will be called from Falcone Component, when user clicks Find Falcone button in Falcone component and passed as a props to Falcone component.
      
      - getResults -> Returns Promise with results received from API request. Accepts reqBody as arguments, reqBody JSON object contains planets and vehicles details with above generated token. This method will be called after token promise resolved in Falcone component and passed as a props to Falcone component.
