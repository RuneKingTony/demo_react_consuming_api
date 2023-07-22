import './App.css';
import Home from './Home';
import { TodoProvider } from './TodoContext';

function App() {
  return (
   <TodoProvider>
    <Home/>
   </TodoProvider>
    
    
  );
}

export default App;
