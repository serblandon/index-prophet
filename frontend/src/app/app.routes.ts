import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { IndividualAssetComponent } from './components/individual-asset/individual-asset.component';

export const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'ticker/:ticker', component: IndividualAssetComponent }
];
