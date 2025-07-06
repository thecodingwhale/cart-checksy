// Main App component for Bailey Nelson demo
import './App.css'
import { CheckoutForm } from './components/forms/CheckoutForm'
import { FormContainer } from './components/layout/FormContainer'

function App() {
  return (
    <FormContainer
      title="Bailey Nelson Checkout"
      subtitle="Complete your payment details below"
    >
      <CheckoutForm />
    </FormContainer>
  )
}

export default App
