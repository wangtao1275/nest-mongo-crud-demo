import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Employee } from 'src/employee/interfaces/employee.interface';
import { EmployeeDTO } from './employee.dto';
import { EmployeeService } from './employee.service';

@Controller('employees')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Get('/abc')
  getJSON() {
    const tableData = [
      {
        username: 'Test Employee 1',
        anumber: 'A602501',
        team: 'Test team 1',
        location: 'Shanghai',
        squad: 'Solutions',
      },
      {
        username: 'Test Employee 2',
        anumber: 'A602502',
        team: 'Test team 2',
        location: 'Dalian',
        squad: 'Agile Solutions',
      },
      {
        username: 'Test Employee 3',
        anumber: 'A602503',
        team: 'Test team 3',
        location: 'Dalian',
        squad: 'Agile Solutions',
      },
      {
        username: 'Test Employee 4',
        anumber: 'A602504',
        team: 'Test team 2',
        location: 'Shanghai',
        squad: 'Agile Solutions',
      },
      {
        username: 'Test Employee 5',
        anumber: 'A602505',
        team: 'Test team 1',
        location: 'Dalian',
        squad: 'Agile Solutions',
      },
    ];
    return tableData;
  }

  @Get()
  async getEmployees(): Promise<Employee[]> {
    return this.employeeService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: string): Promise<Employee> {
    return this.employeeService.getOne(id);
  }

  @Get('/username')
  async getByName(@Query('username') username: string): Promise<Employee> {
    return this.employeeService.getOneByName(username);
  }

  @Post('/new')
  async newEmployee(@Body() employee: EmployeeDTO): Promise<Employee> {
    return this.employeeService.insertOne(employee);
  }

  @Patch('/update')
  async updateEmployee(@Body() employee: EmployeeDTO): Promise<Employee> {
    return this.employeeService.updateOne(employee);
  }

  @Delete('/delete/:id')
  async deleteEmployee(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.employeeService.deleteOne(id);
  }
}
