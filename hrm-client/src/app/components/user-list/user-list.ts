import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserListComponent implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];

  // SEARCH
  searchText: string = '';

  // PAGINATION
  currentPage: number = 1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // LOAD USERS
  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res.data;
        this.filteredUsers = res.data;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  // SEARCH FUNCTION
  onSearch(): void {

    this.filteredUsers = this.users.filter(u =>
      u.userName.toLowerCase().includes(this.searchText.toLowerCase())
    );

    this.currentPage = 1;
  }

  // PAGINATED DATA
  get pagedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  // PAGE SIZE CHANGE
  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  // NEXT PAGE
  nextPage(): void {
    if (this.currentPage * this.pageSize < this.filteredUsers.length) {
      this.currentPage++;
    }
  }

  // PREVIOUS PAGE
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

    get pageInfo(): string {
    const total = this.filteredUsers.length;

    if (total === 0) {
      return 'No entries';
    }

    const start = (this.currentPage - 1) * this.pageSize + 1;

    let end = this.currentPage * this.pageSize;

    if (end > total) {
      end = total;
    }

    return `Showing ${start} to ${end} of ${total} entries`;
  }

  // DELETE USER
  deleteUser(id: number): void {

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this user?'
    );

    if (!confirmDelete) {
      return; // stop if user clicks Cancel
    }

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        console.error('Delete error:', err);
      }
    });
  }
}
