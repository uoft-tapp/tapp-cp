import React from 'react';
import { } from 'react-bootstrap';

class DdahForm extends React.Component {
    minutesToHour(minutes){
      return (minutes/60).toFixed(2);
    }
    getTotalByDuty(allocations, duty, review=false, round=true){
      let total= 0;
      allocations[duty].items.forEach(allocation=>{
        let minutes = review?allocation.minutes_revised_latest:allocation.minutes;
        total += (allocation.num_units*(!minutes?0:minutes));
      });
      return round?this.minutesToHour(total):total;
    }
    getTotalHours(allocations, duties, review=false){
      let total = 0;
      duties.forEach(duty=>{
        total+= this.getTotalByDuty(allocations, duty, review, false);
      });
      return this.minutesToHour(total);
    }
    getApplicantIndex(ddahs){
      let index = 0;
      ddahs.forEach((ddah, i)=>{
        if(ddah.utorid == this.props.appState.getSelectedApplicant())
          index = i;
      })
      return index;
    }
    render() {
        let selectedApplicant = this.props.appState.getSelectedApplicant();
        if(!selectedApplicant){
          return null;
        }
        let signatures = this.props.mockDdahData.signatures;
        let review_signatures = this.props.mockDdahData.mid_course_review_changes;
        let ddahs = this.props.mockDdahData.ddahs_entries;
        let index = this.getApplicantIndex(ddahs);
        let allocations= this.props.mockDdahData.ddahs_entries[index].duty_allocations;
        let duties = Object.keys(allocations);

        return (
            <div id="ddah-form" className="container-fluid container-fit">
                <header>
                    <h3>Description of Duties and Allocation of Hours (DDAH)</h3>
                </header>

                <Panel {...this.props} value={
                  <div className="row">
                      <div className="col-sm-7">
                          <section id="ta-person">
                              <div id="ta-info">
                                  <h3 id="ta-name">{ddahs[index].name}</h3>
                              </div>
                          </section>
                      </div>

                      <div className="col-sm-5">
                          <img id="dcs-logo-ddah" className="img-responsive" src="<%= asset_url('dcs_logo_blue_big.jpg') %>" />
                      </div>
                  </div>
                }/>

                <CourseInfoHeader {...this.props} />

                <Panel {...this.props} title='Allocation of Hours Worksheet'
                  value={
                    <table id="duty-table" className="table table-hover">
                        <thead><tr>
                          {duty_table_headings.map((heading,i)=>
                            <th key={i}>{heading}</th>
                          )}
                        </tr></thead>
                        {duties.map((duty,i)=>
                          <DutyAllocation {...this.props} key={i}
                            title={allocations[duty].heading} total={this.getTotalByDuty(allocations, duty)}
                            allocations={allocations[duty].items} minutesToHour={this.minutesToHour}/>
                        )}
                        <DutyTableTotal {...this.props}
                          hour_per_unit={this.getTotalHours(allocations, duties)}
                          review_hours={this.getTotalHours(allocations, duties, true)}
                          total={this.getTotalHours(allocations, duties)}/>
                    </table>
                  }
                  footer='** Revised as necessary, following mid-course review'/>

                <div className="row">
                    <HalfPanel title='Training'
                      value={this.props.mockDdahData.training.map((item, i)=>
                            <CheckBoxItem {...this.props} key={i} item={'training' + i} category='trainings'
                              checked={item.checked} name={item.name} value={item.id}/>
                        )} {...this.props}/>
                    <HalfPanel title='Tutorial Category (1 primary activity)' list={true}
                      value={this.props.mockDdahData.tutorial_category.map((item, i)=>
                            <RadioItem {...this.props} key={i} item={'tutorial' + i} category='tutorial-category'
                              checked={item.checked} name={item.name} />
                        )} {...this.props}/>
                </div>
                <SignatureBlock {... this.props}
                  signatures={signatures} review_signatures={review_signatures} />
            </div>
        );
    }
}

const duty_table_headings = ['# Unit', 'Type of Unit', 'Hours per Unit', 'Hours Revision **', 'Total Hours'];

const DutyTableTotal = props =>(
  <tbody>
    <tr className="info row-total">
        <td>Total</td>
        <td></td>
        <td>{props.hour_per_unit}</td>
        <td>{props.review_hours}</td>
        <td>{props.total}</td>
    </tr>
  </tbody>
);

const DutyAllocation = props =>(
  <tbody>
  <DutyHeading {...props} title={props.title} total={props.total}/>
  {props.allocations.map((allocation, i)=>
    <Allocation {...props} key={i}
      num_unit={allocation.num_units}
      duty={allocation.unit_name}
      time={props.minutesToHour(allocation.minutes)}
      revised_time={allocation.is_revised?
        props.minutesToHour(allocation.minutes_revised_latest):''}/>
  )}
  </tbody>
);

const DutyHeading = props =>(
  <tr className="duty-heading">
      <th colSpan="4">{props.title}</th>
      <td className="total">{props.total}</td>
  </tr>
);

const Allocation = props =>(
  <tr>
      <td className="number-of-units">{props.num_unit}</td>
      <td className="duty-description">{props.duty}</td>
      <td className="unit-time">{props.time}</td>
      <td className="revised-time">{props.revised_time}</td>
      <td></td>
  </tr>
);

const HalfPanel = props =>(
  <div className='col-sm-6'>
    <Panel {...props} title={props.title}
      value={props.value} list={props.list}
      footer={props.footer} />
  </div>
);

const Panel = props =>(
  <div className='panel panel-default'>
    {props.title?<PanelHeading {...props} title={props.title}/>:''}
    <div className={props.list?'group-list':'panel-body'}>
      {props.value}
    </div>
    {props.footer?<div className="worksheet-footer panel-footer">{props.footer}</div>:''}
  </div>
);

const PanelHeading = props =>(
  <div className="panel-heading">
    <h3 className="panel-title">{props.title}</h3>
  </div>
);

const CheckBoxItem = props =>(
  <div className="checkbox" key={props.item}>
    <SelectableInput {...props} type='checkbox' value={props.value}
      checked={props.checked} category={props.category} name={props.name} />
  </div>
);

const RadioItem = props =>(
  <div className="list-group-item list-group-item-condensed" key={props.item}>
    <SelectableInput {...props} type='radio' value=''
      checked={props.checked} category={props.category} name={props.name} />
  </div>
);

const SelectableInput = props =>(
  <div className={props.type}>
      <label>
          <input name={props.category} type={props.type}
            defaultChecked={props.checked} value={props.value}/>
          {props.name}
      </label>
  </div>
);

const SignatureBlock = props =>(
  <section id="signature-block" className="panel panel-default panel-warning">
      <div className="panel-body bg-warning">
          {Object.keys(props.signatures).map((key, i)=>
            <Signature key={i} signature={props.signatures[key]} {...props} />
          )}
      </div>
      <div className="panel-footer">
          <div className="row">
              <div className="col-sm-12">
                  <h6>Mid-Course Review Changes (if any **)</h6>
              </div>
              <div className="col-sm-12">
                  {Object.keys(props.review_signatures).map((key, i)=>
                    <ReviewSignature key={i} review_signature={props.review_signatures[key]} {...props} />
                  )}
              </div>
          </div>
      </div>
  </section>
);

const Signature = props =>(
  <div className="row">
      <div className="col-sm-12">
          <p className="form-label-heading">{props.signature.title}</p>
      </div>
      <SignatureInput {...props} col_name='signatures' col_size='5'
         help_block='Prepared by (Supervisor)'
         value={props.signature.name}/>
      <SignatureInput {...props} col_name='signatures' col_size='4'
         help_block='SIGNATURE / INITIAL'
         value={props.signature.signature_initials}/>
      <SignatureInput {...props} col_name='signatures' col_size='3'
         help_block='Date'
         value={props.signature.date}/>
  </div>
);

const ReviewSignature = props =>(
  <div className="row">
      <div className="course-change-col col-sm-4">
          <p className="form-label-heading form-control-static pull-right">{props.review_signature.title}</p>
      </div>
      <SignatureInput {...props} col_name='course-change' col_size='4'
        help_block='SIGNATURE / INITIAL'
        value={props.review_signature.signature_initials}/>
      <SignatureInput {...props} col_name='course-change' col_size='3'
        help_block='Date'
        value={props.review_signature.date}/>
  </div>
);

const SignatureInput = props =>(
  <div className={props.col_name +'-col col-sm-'+props.col_size}>
      <div className="form-group">
          <input type="text" className="form-control" value={props.value}/>
          <span className="help-block">{props.help_block}</span>
      </div>
  </div>
);

export const CourseInfoHeader = props => (
  <Panel {...props} value={
    <div className="row">
        <section className="col-xs-8">
            <span>{props.mockDdahData.course_data.code}</span>
            <span>{props.mockDdahData.course_data.prof}</span>
            <div>{props.mockDdahData.course_data.name}</div>
        </section>
        <section className="col-xs-4">
            <form className="form-horizontal">
                <EnrolmentLabel {...props} label='Expected Enrollment'
                  value={props.mockDdahData.course_data.enrollment} />
                <EnrolmentLabel {...props} label='Est. Enrollment / TA'
                  value={props.mockDdahData.course_data.enrollment_rate} />
            </form>
        </section>
    </div>
  }/>
);

const EnrolmentLabel = props =>(
  <div className="form-group form-group-sm">
    <label className="col-xs-7 control-label">{props.label}</label>
    <div className="col-xs-3">
        <p className="form-control-static">{props.data}</p>
    </div>
  </div>
);


export { DdahForm };
