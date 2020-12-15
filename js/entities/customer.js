class Customer {

    constructor(firstname, lastname, email, password, phone, fax, company, address, city, state, country, postalCode) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.fax = fax;
        this.company = company;
        this.address = address;
        this.city = city;
        this.state = state;
        this.country = country;
        this.postalCode = postalCode;
    }

    toJson() {
        return {
            'first_name': this.firstname,
            "last_name": this.lastname,
            "email": this.email,
            "password": this.password,
            "phone": this.phone,
            "fax": this.fax,
            "company": this.company,
            "address": this.address,
            "city": this.city,
            "postal_code": this.postalCode,
            "state": this.state,
            "country": this.country
        };
    }
}