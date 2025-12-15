import { Routes } from '@angular/router';
import { ProductComponent } from './components/component-product/product/product.component';
import { ExistencesProductComponent } from './components/component-product/existences-product/existences-product.component';
import { ProductLoadComponent } from './components/component-product/load-product/product-load.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth.guard';
import { ErrorPageComponent } from './components//error-page/error-page.component';
import { SalesComponent } from './components/sales/sales.component';
import { PricesComponent } from './components/prices/prices.component';
import { WarehouseComponent } from './components/warehouse/warehouse.component';
import { DashboardsComponent } from './components/dashboards/dashboards.component';
import { SuscriptionsComponent } from './components/suscriptions/suscriptions.component';
import { OtherComponent } from './components/other/other.component';
import { IndexComponent } from './index/index.component';
import { HomeComponent } from './components/home/home.component';
import { PricesProductComponent } from './components/component-product/prices-product/prices-product.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { CustomersComponent } from './components/customers/customers.component';
import { CustomerComponent } from './components/customer/customer.component';
import { authGuardLogin } from './auth.guard.login';
import { TicketComponent } from './components/ticket/ticket.component';
import { SaleProductsComponent } from './components/sale/sale-products/sale-products.component';
import { EmptyComponent } from './components/empty/empty/empty.component';
import { PrinterComponent } from './components/printer/printer.component';

export const routes: Routes = [
    {path: "home", component: DashboardsComponent, canActivate: [AuthGuard]},
    {path: "saleProducts", component: SaleProductsComponent, canActivate: [AuthGuard]},
    {path: "sales", component: SalesComponent, canActivate: [AuthGuard]},
    {path: "prices", component: PricesComponent, canActivate: [AuthGuard]},
    {path: "customers", component: CustomersComponent, canActivate: [AuthGuard]},
    {path: "customer", component: CustomerComponent, canActivate: [AuthGuard]},
    {path: "customer/:id", component: CustomerComponent, canActivate: [AuthGuard]},
    {path: "warehouse", component: WarehouseComponent, canActivate: [AuthGuard]},
    {path: "dashboards", component: DashboardsComponent, canActivate: [AuthGuard]},
    {path: "suscriptions", component: SuscriptionsComponent, canActivate: [AuthGuard]},
    {path: "other", component: OtherComponent, canActivate: [AuthGuard]},
    {path: 'product', component: ProductComponent, canActivate: [AuthGuard]},
    {path: 'product/:id', component: ProductComponent, canActivate: [AuthGuard]},
    {path: "pricesProduct", component: PricesProductComponent, canActivate: [AuthGuard]},
    {path: "pricesProduct/:id", component: PricesProductComponent, canActivate: [AuthGuard]},
    {path: 'existencesProduct', component: ExistencesProductComponent, canActivate: [AuthGuard]},
    {path: 'productLoad', component: ProductLoadComponent, canActivate: [AuthGuard]},
    {path: 'productLoad/:id', component: ProductLoadComponent, canActivate: [AuthGuard]},
    {path: "login", component: LoginComponent},
    {path: "configuration", component: ConfigurationComponent, canActivate: [AuthGuard]},
    {path: "profile", component: ProfileComponent, canActivate: [AuthGuard]},
    {path: "notifications", component: NotificationsComponent, canActivate: [AuthGuard]},
    {path: "ticket/:id", component: TicketComponent, canActivate: [AuthGuard]},
    {path: "errorPage", component: ErrorPageComponent},
    {path: "index", component: IndexComponent},
    {path: "empty", component: EmptyComponent},
    {path: "printer", component: PrinterComponent},
    {path: "", redirectTo: "login", pathMatch:"full"},
    {path: "**", redirectTo: 'errorPage'}
];
