import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export default class LandingPage {
  // Images exported from Figma MCP
  heroImage = 'http://localhost:3845/assets/f8feb82e1f3b0fdb9e5fee76effe32a8cb5f74a4.png';
  cardImageA = 'http://localhost:3845/assets/4d7596c67af2f2da4736a23edc8400c52f16c0d1.png';
  cardImageB = 'http://localhost:3845/assets/b4f7b177395427ba54ddf995fa7a5a9d4a840a55.png';
  cardImageC = 'http://localhost:3845/assets/d35b8beae901942270a3237650b76bd977446785.png';
  logoSvg = 'http://localhost:3845/assets/584142ed1512a400783b72e97722c1531934d736.svg';
  logoSvgAlt = 'http://localhost:3845/assets/10e0aee3fab2b6f0b301128b81f76784135698ab.svg';
  vec0 = 'http://localhost:3845/assets/9b2c012ce9b65a2b8d7300af70c92aee4d05abb4.svg';
  vec1 = 'http://localhost:3845/assets/ff1a0790bc86831cba6423a1310ee128afda4458.svg';
  vec2 = 'http://localhost:3845/assets/a9a0604fb906a30e82c63ab147ce5b59effd59b8.svg';
  vec3 = 'http://localhost:3845/assets/2088765fb5121fafa7cd3b29fa219a3bb053aaad.svg';
  vec4 = 'http://localhost:3845/assets/b15bc71f45513f86fb8d4ce4d4d77efb3b635851.svg';
  vec5 = 'http://localhost:3845/assets/6a1cbf848655ea0d09a926555f8255f65ff3c723.svg';
}
