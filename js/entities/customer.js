class Customer {
    // fields
    firstname = null;
    lastname = null;
    email = null;
    password = null;
    phone = null;
    fax = null;
    company = null;
    address = null;
    city = null;
    state = null;
    country = null;
    postalCode = null;

    // states
    isValidFirstName = false;
    isValidLastName = false;
    isValidEmail = false;
    isValidPassword = false;
    isValidPhone = true;
    isValidFax = true;
    isValidCompany = true;
    isValidAddress = true;
    isValidCity = true;
    isValidState = true;
    isValidCountry = true;
    isValidPostalCode = true;


    constructor() {}

    isValid() {
        return (this.isValidFirstName && this.lastname && this.isValidEmail && this.isValidPassword &&
            this.isValidPhone && this.isValidFax && this.isValidCompany && this.isValidAddress &&
            this.isValidCity && this.isValidState && this.isValidCountry && this.isValidPostalCode)
    }
}