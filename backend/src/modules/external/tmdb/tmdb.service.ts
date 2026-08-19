import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

export interface ExternalEvent {
  externalId: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  location: string;
  suggestedPrice: number;
}

export interface TmdbImageConfiguration {
  base_url: string;
  secure_base_url: string;
  backdrop_sizes: string[];
  logo_sizes: string[];
  poster_sizes: string[];
  profile_sizes: string[];
  still_sizes: string[];
}

export interface TmdbConfigurationResponse {
  images: TmdbImageConfiguration;
  change_keys: string[];
}

export interface TmdbMovieResult {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: string;
  adult?: boolean;
  original_language?: string;
  genre_ids?: number[];
  popularity?: number;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
}

export interface TmdbTrendingResponse {
  page: number;
  results: TmdbMovieResult[];
  total_pages: number;
  total_results: number;
}

@Injectable()
export class TmdbService {
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey = process.env.TMDB_API_KEY || process.env.API_KEY || '';
  private readonly bearerToken = process.env.TMDB_BEARER_TOKEN || process.env.TICKETMASTER_API_KEY || '';
  private configCache: TmdbConfigurationResponse | null = null;

  /**
   * Obtém as configurações oficiais de imagem do TMDB
   * Ref: https://developer.themoviedb.org/reference/configuration-details
   */
  async getConfiguration(): Promise<TmdbConfigurationResponse> {
    if (this.configCache) {
      return this.configCache;
    }

    const url = `${this.baseUrl}/configuration`;
    const headers = this.getHeaders();
    const finalUrl = this.getFinalUrl(url);

    try {
      const response = await fetch(finalUrl, { headers });
      if (!response.ok) {
        throw new Error(`TMDB responded with status ${response.status}`);
      }

      const data: TmdbConfigurationResponse = await response.json();
      this.configCache = data;
      return data;
    } catch (error) {
      console.error('TMDB Configuration Error:', error);
      return {
        images: {
          base_url: 'http://image.tmdb.org/t/p/',
          secure_base_url: 'https://image.tmdb.org/t/p/',
          backdrop_sizes: ['w300', 'w780', 'w1280', 'original'],
          logo_sizes: ['w45', 'w92', 'w154', 'w185', 'w300', 'w500', 'original'],
          poster_sizes: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
          profile_sizes: ['w45', 'w185', 'h632', 'original'],
          still_sizes: ['w92', 'w185', 'w300', 'original'],
        },
        change_keys: [],
      };
    }
  }

  async getImageBaseUrl(size: string = 'w500'): Promise<string> {
    try {
      const config = await this.getConfiguration();
      const secureBaseUrl = config.images?.secure_base_url || 'https://image.tmdb.org/t/p/';
      return `${secureBaseUrl}${size}`;
    } catch {
      return `https://image.tmdb.org/t/p/${size}`;
    }
  }

  /**
   * Consulta os filmes em tendência (Trending Movies)
   * Ref: https://developer.themoviedb.org/reference/trending-movies
   * GET /3/trending/movie/{time_window}?language=...
   */
  async getTrendingMovies(
    timeWindow: 'day' | 'week' = 'day',
    language: string = 'pt-BR',
  ): Promise<TmdbTrendingResponse> {
    const url = `${this.baseUrl}/trending/movie/${timeWindow}?language=${encodeURIComponent(language)}`;
    const headers = this.getHeaders();
    const finalUrl = this.getFinalUrl(url);

    try {
      const response = await fetch(finalUrl, { headers });
      if (!response.ok) {
        throw new Error(`TMDB responded with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`TMDB Trending Movies Error (${timeWindow}):`, error);
      throw new HttpException('Erro ao consultar filmes em alta do TMDB', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Retorna os eventos externos para importação no catálogo
   * Prioriza /trending/movie/day conforme documentação oficial TMDB
   */
  async getExternalEvents(keyword?: string): Promise<ExternalEvent[]> {
    const endpoint = keyword
      ? `/search/movie?query=${encodeURIComponent(keyword)}&language=pt-BR`
      : `/trending/movie/day?language=pt-BR`;

    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders();
    const finalUrl = this.getFinalUrl(url);

    try {
      const response = await fetch(finalUrl, { headers });
      if (!response.ok) {
        throw new Error(`TMDB responded with status ${response.status}`);
      }

      const data = await response.json();
      const imageBaseUrl = await this.getImageBaseUrl('w500');

      return (data.results || []).slice(0, 12).map((movie: TmdbMovieResult) => ({
        externalId: `tmdb-${movie.id}`,
        title: movie.title || movie.original_title,
        description: movie.overview || 'Sinopse oficial The Movie Database.',
        imageUrl: movie.poster_path
          ? `${imageBaseUrl}${movie.poster_path}`
          : movie.backdrop_path
          ? `${imageBaseUrl}${movie.backdrop_path}`
          : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',
        date: movie.release_date ? new Date(movie.release_date).toISOString() : new Date().toISOString(),
        location: 'Cine Theatro Brasil / Sala TMDB',
        suggestedPrice: 35.00,
      }));
    } catch (error) {
      console.error('TMDB API Error:', error);
      // Fallback gracioso com filmes conhecidos se a API externa falhar ou não possuir chave ativa no momento
      return this.getFallbackMovies();
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      accept: 'application/json',
    };
    if (this.bearerToken) {
      headers['Authorization'] = `Bearer ${this.bearerToken}`;
    }
    return headers;
  }

  private getFinalUrl(url: string): string {
    if (!this.bearerToken && this.apiKey) {
      const joinChar = url.includes('?') ? '&' : '?';
      return `${url}${joinChar}api_key=${this.apiKey}`;
    }
    return url;
  }

  private getFallbackMovies(): ExternalEvent[] {
    return [
      {
        externalId: 'tmdb-533535',
        title: 'Deadpool & Wolverine',
        description: 'Um apático Wade Wilson labuta na vida civil até que o multiverso o chama de volta para uma missão épica.',
        imageUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
        date: new Date().toISOString(),
        location: 'Cine Theatro Brasil / Sala TMDB',
        suggestedPrice: 42.00,
      },
      {
        externalId: 'tmdb-1022789',
        title: 'Divertida Mente 2',
        description: 'A sala de controle passa por uma reforma para abrir espaço para novas emoções inesperadas.',
        imageUrl: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
        date: new Date().toISOString(),
        location: 'Cine Theatro Brasil / Sala TMDB',
        suggestedPrice: 38.00,
      },
      {
        externalId: 'tmdb-693134',
        title: 'Duna: Parte 2',
        description: 'Paul Atreides se une a Chani e aos Fremen em busca de vingança contra os conspiradores que destruíram sua família.',
        imageUrl: 'https://image.tmdb.org/t/p/w500/czembW0Rk1Ke7lCJGahbOhdCuhV.jpg',
        date: new Date().toISOString(),
        location: 'Cine Theatro Brasil / Sala TMDB',
        suggestedPrice: 45.00,
      },
      {
        externalId: 'tmdb-763215',
        title: 'Damsel (Donzela)',
        description: 'Uma princesa dedicada concorda em se casar com um príncipe bonito, apenas para descobrir que tudo é uma armadilha.',
        imageUrl: 'https://image.tmdb.org/t/p/w500/sMp34cNKjIb18UBVJ3CUzqEsY2.jpg',
        date: new Date().toISOString(),
        location: 'Cine Theatro Brasil / Sala TMDB',
        suggestedPrice: 35.00,
      },
    ];
  }
}

