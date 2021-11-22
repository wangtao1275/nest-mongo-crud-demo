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

  @Get()
  getJSON() {
    const tableData = [
      {
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
      },
      {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1517 弄',
        zip: 200333,
      },
      {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1519 弄',
        zip: 200333,
      },
      {
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1516 弄',
        zip: 200333,
      },
    ];
    return tableData;
  }

  @Get('/abc')
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
