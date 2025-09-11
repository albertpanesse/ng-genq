import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  sender: 'user' | 'llm';
  text: string;
}

@Component({
  selector: 'app-chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatWidgetComponent {
  isOpen = false;
  isMinimized = false;
  messages: ChatMessage[] = [];
  inputText: string = '';

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.isMinimized = false; // reset minimize saat buka lagi
  }

  minimizeChat() {
    this.isMinimized = true;
  }

  restoreChat() {
    this.isMinimized = false;
    this.isOpen = true;
  }

  sendMessage() {
    if (!this.inputText.trim()) return;

    this.messages.push({ sender: 'user', text: this.inputText });

    // Simulasi respons LLM
    setTimeout(() => {
      this.messages.push({
        sender: 'llm',
        text: 'Contoh SQL dari LLM: SELECT * FROM table WHERE ...'
      });
    }, 800);

    this.inputText = '';
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.messages.push({
        sender: 'user',
        text: `📂 Upload file: ${file.name}`
      });
      // TODO: kirim file ke backend
    }
  }
}
