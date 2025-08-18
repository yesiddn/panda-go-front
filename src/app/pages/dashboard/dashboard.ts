import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export default class DashboardPage {
  // Assets exported from Figma MCP for the Dashboard selection
  imgDepth4Frame3 = 'http://localhost:3845/assets/06ee50d764a2457316f725d374d653f0a7b48ed7.png';
  imgDepth6Frame0 = 'http://localhost:3845/assets/38df734b8edec914ee2c72b767a467be3efdca5a.png';
  imgVector0 = 'http://localhost:3845/assets/fa8716fd1c54c882d5398aa9bd9847d791962db5.svg';
  imgVector1 = 'http://localhost:3845/assets/bf43d045e6e5cf83f2fd83653d71bfbef8b3ae27.svg';
  imgVector2 = 'http://localhost:3845/assets/c1b1ce11bed9e5e63629b4495f2fea4e4d0975e2.svg';
  imgDepth7Frame0 = 'http://localhost:3845/assets/38a727bef02d5aecc236211480e3fe2b87ec1019.svg';
  imgVector3 = 'http://localhost:3845/assets/b3dc47c0b1ed6dc67b2d21d2fe24b2269f55d018.svg';
  imgDepth7Frame1 = 'http://localhost:3845/assets/9107f2a48fa0373684aa9b72378ee0fa74a3ee30.svg';
  imgDepth7Frame2 = 'http://localhost:3845/assets/f958b8cc2d832bf315bf75166b589bbf218e4031.svg';
  imgDepth6Frame1 = 'http://localhost:3845/assets/ebecae175e61a682fc1a56fbdd0e58654e24701a.svg';
  imgDepth6Frame2 = 'http://localhost:3845/assets/18d2c2faa8b4a2b6979d7c011386ec7f2c10caa2.svg';
  imgDepth6Frame3 = 'http://localhost:3845/assets/548f1cbcde8e6d4b0be61b84ec011b05cb7c3758.svg';
  imgDepth6Frame4 = 'http://localhost:3845/assets/6d27fd192c4f30704bcb6261d7b17082b44f7d3b.svg';
}
