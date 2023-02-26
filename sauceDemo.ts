import { Selector, t } from "testcafe";
import { faker } from '@faker-js/faker';

class LoginPage {
    private readonly usernameInput : Selector;
    private readonly passwordInput : Selector;
    private readonly loginButton : Selector;

    constructor(){
        this.usernameInput = Selector('#user-name')
        this.passwordInput = Selector('#password')
        this.loginButton = Selector('#login-button')
    }

    async login(username: string, password: string){
        await t
            .typeText(this.usernameInput, username)
            .typeText(this.passwordInput, password)
            .click(this.loginButton);
    }
}

class InventoryPage {
    private readonly addToCartButtons: Selector;
    private readonly cartIcon: Selector;

    constructor() {
        this.addToCartButtons = Selector('button').withText('ADD TO CART');
        this.cartIcon = Selector('.shopping_cart_link');
    }

    async addToCart(index: number) {
        await t
            .click(this.addToCartButtons.nth(index));
    }

    async goToCart() {
        await t
            .click(this.cartIcon);
    }
}


class CartPage {
    private readonly cartItems: Selector;
    private readonly checkoutButton: Selector;

    constructor() {
        this.cartItems = Selector('.cart_item');
        this.checkoutButton = Selector('#checkout');
    }

    async verifyCartItemCount(expectedCount: number) {
        const count = await this.cartItems.count;

        await t
            .expect(count).eql(expectedCount);
    }

    async checkout() {
        await t
            .click(this.checkoutButton);
    }
}

class CheckoutPage {
    private readonly firstNameInput: Selector;
    private readonly lastNameInput: Selector;
    private readonly postalCodeInput: Selector;
    private readonly continueButton: Selector;
    private readonly finishButton: Selector;

    constructor() {
        this.firstNameInput = Selector('#first-name');
        this.lastNameInput = Selector('#last-name');
        this.postalCodeInput = Selector('#postal-code');
        this.continueButton = Selector('#continue');
        this.finishButton = Selector('#finish');
    }

    async enterCheckoutInformation() {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const postalCode = faker.address.zipCode();

        await t
            //provide a random FirstName, LastName and ZipCode 
            .typeText(this.firstNameInput, firstName)
            .typeText(this.lastNameInput, lastName)
            .typeText(this.postalCodeInput, postalCode)
            .click(this.continueButton);
    }

    async completeCheckout() {
        await t.click(this.finishButton);//click finish button
    }
}


fixture `Sauce Demo`
    .page `https://www.saucedemo.com`;


test('Add two products to the cart and complete checkout process', async t => {
    const loginPage = new LoginPage();
    const inventoryPage = new InventoryPage();
    const cartPage = new CartPage();
    const checkoutPage = new CheckoutPage();    


    // login to the system
    await t
        loginPage.login('performance_glitch_user' , 'secret_sauce')  

    // check the price of product
    const productPrice = await Selector ('.inventory_item_price').withExactText('$49.99').exists;

    await t
        .expect('productprice').ok();

    // add two product to the cart
    await inventoryPage.addToCart(0);
    await inventoryPage.addToCart(2);
    await inventoryPage.goToCart();

    //verify if the selected items are in the cart
    await cartPage.verifyCartItemCount(2);
    await cartPage.checkout();

    //click checout button
    await checkoutPage.enterCheckoutInformation();
    await checkoutPage.completeCheckout();   

    //veryfy that the checkout completed successfully
    const ThankYouMassage = await Selector ('.complete-header').innerText;
    
    await t
        .expect(ThankYouMassage).eql('THANK YOU FOR YOUR ORDER');
 
});