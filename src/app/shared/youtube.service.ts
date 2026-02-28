import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap, map, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  date: string;
}

interface YouTubeSearchResponse {
  items: {
    id: { videoId: string };
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: { medium: { url: string }; high: { url: string } };
    };
  }[];
  nextPageToken?: string;
}

interface YouTubeChannelResponse {
  items: {
    id: string;
    contentDetails: {
      relatedPlaylists: { uploads: string };
    };
  }[];
}

interface YouTubePlaylistResponse {
  items: {
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: { medium: { url: string }; high: { url: string } };
      resourceId: { videoId: string };
    };
  }[];
  nextPageToken?: string;
  pageInfo: { totalResults: number };
}

@Injectable({ providedIn: 'root' })
export class YouTubeService {
  private apiBase = 'https://www.googleapis.com/youtube/v3';
  private apiKey = environment.youtubeApiKey;
  private channelHandle = 'alokcentralschool7866';

  constructor(private http: HttpClient) {}

  getVideos(maxResults = 50): Observable<YouTubeVideo[]> {
    return this.getChannelId().pipe(
      switchMap(channelId => this.getUploadPlaylistId(channelId)),
      switchMap(playlistId => this.getPlaylistVideos(playlistId, maxResults)),
      catchError(err => {
        console.error('YouTube API error:', err);
        return of([]);
      })
    );
  }

  private getChannelId(): Observable<string> {
    const url = `${this.apiBase}/channels?part=id&forHandle=${this.channelHandle}&key=${this.apiKey}`;
    return this.http.get<YouTubeChannelResponse>(url).pipe(
      map(res => {
        if (!res.items?.length) throw new Error('Channel not found');
        return res.items[0].id;
      })
    );
  }

  private getUploadPlaylistId(channelId: string): Observable<string> {
    const url = `${this.apiBase}/channels?part=contentDetails&id=${channelId}&key=${this.apiKey}`;
    return this.http.get<YouTubeChannelResponse>(url).pipe(
      map(res => {
        if (!res.items?.length) throw new Error('Channel details not found');
        return res.items[0].contentDetails.relatedPlaylists.uploads;
      })
    );
  }

  private getPlaylistVideos(playlistId: string, maxResults: number): Observable<YouTubeVideo[]> {
    const url = `${this.apiBase}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${this.apiKey}`;
    return this.http.get<YouTubePlaylistResponse>(url).pipe(
      map(res => res.items.map(item => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
        publishedAt: item.snippet.publishedAt,
        date: new Date(item.snippet.publishedAt).toLocaleDateString('en-IN', {
          year: 'numeric', month: 'short', day: 'numeric'
        }),
      })))
    );
  }
}
