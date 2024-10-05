import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../models/member';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../_services/likes.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
  member = input.required<Member>();
  private likeService = inject(LikesService)

  hasLiked = computed(() => this.likeService.likeIds().includes(this.member().id))

  toggleLike(){
    this.likeService.toggleLike(this.member().id).subscribe({
      next: _ => {
        if(this.hasLiked()){
          this.likeService.likeIds.update(ids => ids.filter(x => x!== this.member().id))
        }else{
          this.likeService.likeIds.update(ids => [...ids, this.member().id])

        }
      }
    })
  }
}
