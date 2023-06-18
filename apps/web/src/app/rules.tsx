export default function RulesSection() {
  return (
    <section id="rules" className="rules">
      <h2>Rules</h2>
      <div className="content-container xlarge">
        <div className="column-left">
          <h3>Youth Team</h3>
          <ul>
            <li>
              <details>
                <summary>Forming a team</summary>
                <div>Each team must have no more than 24 runners.</div>
                <div>Each runner can only run for one team.</div>
                <div>
                  Each runner must be 10 years of age or older, and younger than
                  18 .
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>Competition rules</summary>
                <div>
                  Members of the relay team can run multiple legs, and the team
                  must run a total of 4 hours continuously.
                </div>
                <div>
                  The team that covers the longest distance wins the race.
                </div>
                <div>
                  Each leg of the relay must be no less than 10 minutes.
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>​​Calculating the final result of a team</summary>
                <div>
                  Each team must calculate the weighted coefficient of the team,
                  which is based on each member’s age, gender, and running time
                  entered on the registration form. The team’s weighted
                  coefficient must be reported the day before the race. The
                  team’s distance for record-keeping in determining the winner
                  is calculated as the actual distance covered in the relay by
                  the team and its weighted coefficient.
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>Calculating the weighted coefficient</summary>
                <div>TBD</div>
              </details>
            </li>
          </ul>
        </div>

        <div className="column-right">
          <h3>Adult Team</h3>
          <ul>
            <li>
              <details>
                <summary>Forming a team</summary>
                <div>Each team must have no more than 24 runners.</div>
                <div>Each runner can only run for one team.</div>
                <div>Each runner must be 18 years of age or older.</div>
              </details>
            </li>
            <li>
              <details>
                <summary>Competition rules</summary>
                <div>
                  Each member of the relay team must run ONE (and ONLY one) leg
                  of the relay, and the team must run a total of 8 hours
                  continuously.
                </div>
                <div>
                  The team that covers the longest distance wins the race.
                </div>
                <div>
                  Each leg of the relay must be no less than 20 minutes.
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>​​Calculating the final result of a team</summary>
                <div>
                  Quis at voluptatibus quas corrupti! Quibusdam vitae quas atque
                  voluptas?
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>Calculating the weighted coefficient</summary>

                <div>
                  The basic coefficient is calculated based on the qualification
                  time for Boston Marathon (BQ) (see the table below – Boston
                  present qualifying times 2020). <br />
                  <br />
                  The coefficient = Marathon BQ time / 200 minutes (see
                  Coefficient Table below).
                  <br />
                  <br />
                  Each team calculates the total coefficient minutes by taking
                  the corresponding coefficient based on each member’s age and
                  gender (from the table below) multiplied by the registered
                  running minutes and adding it up. <br />
                  <br />
                  The weighted coefficient = the total coefficient minutes / 480
                  minutes (rounded up to 4 decimals)
                  <br />
                  <br />
                  The “baton” must be passed from one member to another with a
                  1-minute buffer before or after the designated time. If the
                  “baton” is passed outside the buffer, for each minute earlier
                  or delayed, the team will be penalized by subtracting one
                  kilometer from its covered distance in record keeping. Any
                  time under one minute will be counted as one minute for
                  penalty. <br />
                  <br />
                  For omissions or disputes in the rules of the competition, the
                  organizing committee has the final interpretation and
                  decision-making power.
                  <br />
                  <br />
                  Coeficient Table
                  <ul className="coefficient-table mt-20">
                    <li>
                      <div>Age</div>
                      <div>Male Marathon BQ Time (min)</div>
                      <div>Male Coefficient</div>
                      <div>Female Marathon BQ Time (min)</div>
                      <div>Female Coefficient</div>
                    </li>
                    <li>
                      <div>18</div>
                      <div>180</div>
                      <div>0.9</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                    <li>
                      <div>19</div>
                      <div>180</div>
                      <div>0.9</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                    <li>
                      <div>20</div>
                      <div>180</div>
                      <div>21</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                    <li>
                      <div>22</div>
                      <div>180</div>
                      <div>0.9</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                    <li>
                      <div>23</div>
                      <div>180</div>
                      <div>0.9</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                    <li>
                      <div>24</div>
                      <div>180</div>
                      <div>0.9</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                    <li>
                      <div>25</div>
                      <div>180</div>
                      <div>0.9</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                  </ul>
                </div>
              </details>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
