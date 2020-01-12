import Vue from 'vue'
import Router from 'vue-router'
import CategoryComponent from '../components/pages/categories/CategoryIndexComponent'
import ProductComponent from '../components/pages/products/ProductsComponent'
import ProductAdd from '../components/pages/products/Add'
import ProductEdit from '../components/pages/products/Edit'
import DeleteProduct from '../components/pages/products/DeleteProduct'
import AddProductMissing from '../components/pages/products/AddMissingProduct'
import ProductMissingList from '../components/pages/products/MissingProductList'
import TransactionComponent from '../components/pages/transaction/TransactionComponent'
import CustomerComponent from '../components/pages/customer/CustomerComponent'
import CustomerTransitionsComponent from '../components/pages/customer/CustomerTransitionsComponent'
import CreateCustomerLedger from '../components/pages/customer/CreateCustomerLedger'
import ShopComponent from '../components/pages/shop/ShopComponent'
import CreateTransaction from '../components/pages/transaction/CreateTransactionComponent'
import CreateManualTransaction from '../components/pages/transaction/CreateManualTransaction'
import CreateDueTransaction from '../components/pages/transaction/CreateDueTransactionComponent'
import TransactionPrint from '../components/pages/transaction/TransactionPrintComponent'
import SaleReturn from '../components/pages/transaction/SaleReturn'
import EditTransactionComponent from '../components/pages/transaction/EditTransactionComponent'
import LoginComponent from '../components/pages/login/LoginComponent'
import ExpenseComponent from '../components/pages/expense/ExpenseComponent'
import ExpenseCategoryComponent from '../components/pages/expense/ExpenseCategoryComponent'
import AccountExpenseComponent from '../components/pages/accounting/expense/ExpenseAccountingComponent'
import BalanceAccountingComponent from '../components/pages/accounting/balance/BalanceAccountingComponent'
import ProductTransaction from '../components/pages/accounting/product_transaction/TransactionAccountingComponent'
import CustomerAccountingTransaction from '../components/pages/accounting/customer/CustomerAccountingComponent'
import UserComponent from '../components/pages/user/UserComponent'
import BankComponent from '../components/pages/bank/BankComponent'
import BankAccountComponent from '../components/pages/bank/BankAccountComponent'
import AccountTransactionComponent from '../components/pages/bank/AccountTransactionComponent'
import CompanyComponent from '../components/pages/company/CompanyComponent'
import CompanyTransaction from '../components/pages/company/CompanyTransitionsComponent'
import CompanyReturnCreate from '../components/pages/company/CompanyReturnCreate'
import CompanyReturnList from '../components/pages/company/CompanyReturnList'
import AddCompanyTransaction from '../components/pages/company/transition/Add'
import CreateSaleAssistanceComponent from '../components/pages/sale-assistance/CreateSaleAssistanceComponent'
import UpdateSaleAssistanceComponent from "../components/pages/sale-assistance/UpdateSaleAssistanceComponent";
import CreateSaleAssistanceTransition from "../components/pages/sale-assistance/CreateTransaction";
import CashComponent from "../components/pages/cash/CashComponent";
import CustomerLedgerPrintComponent from "../components/pages/customer/CustomerLedgerPrintComponent";
import CustomerLedgerPrintAllComponent from "../components/pages/customer/CustomerLedgerPrintAllComponent";

Vue.use(Router)

const routes = [
    {
        path: '/',
        name: 'login',
        component: LoginComponent
    },

    {
        path: '/home',
        name: 'home',
        component: TransactionComponent
    },

    {
        path: '/categories',
        name: 'categories',
        component: CategoryComponent
    },

    {
        path: '/products',
        name: 'products',
        component: ProductComponent
    },

    {
        path: '/products/:id/edit',
        name: 'editProduct',
        component: ProductEdit
    },

    {
        path: '/products/:id/delete',
        name: 'productDelete',
        component: DeleteProduct
    },

    {
        path: '/products/add',
        name: 'productsAdd',
        component: ProductAdd
    },

    {
        path: '/products/missing/add',
        name: 'addProductMissing',
        component: AddProductMissing
    },

    {
        path: '/products/missing/list',
        name: 'productMissingList',
        component: ProductMissingList
    },

    {
        path: '/transaction',
        name: 'transaction',
        component: TransactionComponent
    },

    {
        path: '/transaction/create',
        name: 'create_transaction',
        component: CreateTransaction
    },

    {
        path: '/transaction/create/manual',
        name: 'create_transaction_manual',
        component: CreateManualTransaction
    },

    {
        path: '/transaction/due/create',
        name: 'create_due_transaction',
        component: CreateDueTransaction
    },

    {
        path: '/transaction/:id/edit',
        name: 'edit_transaction',
        component: EditTransactionComponent
    },

    {
        path: '/transaction/:id/print',
        name: 'print_transaction',
        component: TransactionPrint
    },

    {
        path: '/sale-assistance/create',
        name: 'sale_assistance_create',
        component: CreateSaleAssistanceComponent
    },

    {
        path: '/sale-assistance/update',
        name: 'sale_assistance_update',
        component: UpdateSaleAssistanceComponent
    },

    {
        path: '/sale-assistance/:staffId/sale/:barcode',
        name: 'sale_assistance_transaction',
        component: CreateSaleAssistanceTransition
    },

    {
        path:'/sale-return',
        name: 'saleReturn',
        component: SaleReturn
    },

    {
        path: '/customers',
        name: 'customers',
        component: CustomerComponent
    },
    {
        path: '/customers/:id/transitions',
        name: 'customers_transitions',
        component: CustomerComponent
    },
    {
        path: '/customers/ledger',
        name: 'customer_ledger',
        component: CustomerTransitionsComponent
    },
    {
        path: '/customers/ledger/all/:storeId',
        name: 'customer_ledger_all',
        component: CustomerLedgerPrintAllComponent
    },
    {
        path: '/customers/ledger/create',
        name: 'customer_ledger_create',
        component: CreateCustomerLedger
    },

    {
        path: '/customers/:id/print/:storeId',
        name: 'customerLedgerPrint',
        component: CustomerLedgerPrintComponent
    },

    {
        path: '/expense',
        name: 'expense',
        component: ExpenseComponent
    },

    {
        path: '/company',
        name: 'company',
        component: CompanyComponent
    },

    {
        path: '/company/return/add',
        name: 'companyReturnCreate',
        component: CompanyReturnCreate
    },

    {
        path: '/company/return/list',
        name: 'companyReturnList',
        component: CompanyReturnList
    },

    {
        path: '/company/transition/add',
        name: 'addCompanyTransition',
        component: AddCompanyTransaction
    },

    {
        path: '/company/transition/edit',
        name: 'editCompanyTransition',
        component: AddCompanyTransaction
    },

    {
        path: '/companytransaction',
        name: 'ctransaction',
        component: CompanyTransaction
    },

    {
        path: '/expensecategories',
        name: 'expense_categories',
        component: ExpenseCategoryComponent
    },

    {
        path: '/account/transaction',
        name:'accounting_product_transaction',
        component: ProductTransaction
    },

    {
        path: '/account/customer',
        name:'accountingCustomer',
        component: CustomerAccountingTransaction
    },

    {
        path: '/account/expense',
        name:'account_expense',
        component: AccountExpenseComponent
    },

    {
        path: '/account/balance',
        name:'account_balance',
        component: BalanceAccountingComponent
    },

    {
        path: '/shops',
        name: 'shops',
        component: ShopComponent
    },

    {
        path: '/banks',
        name: 'banks',
        component: BankComponent
    },
    {
        path: '/banks/:id/accounts',
        name: 'bankAccount',
        component: BankAccountComponent
    },
    {
        path: '/banks/:bankId/accounts/:accountId/transactions',
        name: 'accountTransaction',
        component: AccountTransactionComponent
    },

    {
        path: '/cash',
        name: 'cash',
        component: CashComponent
    },


    {
        path: '/user',
        name: 'user',
        component: UserComponent
    }
]

export default new Router({
    mode: 'history',
    routes
})
