import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoteModule } from './note/note.module';


@Module({
  imports: [TypeOrmModule.forRoot(), NoteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
